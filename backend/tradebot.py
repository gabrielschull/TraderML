import os
import math
from dotenv import load_dotenv
from lumibot.brokers import Alpaca
from lumibot.backtesting import YahooDataBacktesting
from lumibot.strategies.strategy import Strategy
from lumibot.traders import Trader
from datetime import datetime
from alpaca_trade_api import REST
from timedelta import Timedelta
from finbert_utils import estimate_sentiment

load_dotenv()

BASE_URL = 'https://paper-api.alpaca.markets'

ALPACA_CREDS = {
    'API_KEY': os.getenv('API_KEY'),
    'API_SECRET': os.getenv('API_SECRET'),
    'PAPER': True,
}

class traderML(Strategy):
    def initialize(self, symbol:str='SPY', cash_at_risk: float=.5, sentiment_time_to_consider: int=3, bracket_buy_take_profit_multiplier: float=1.20, bracket_buy_stop_loss_multiplier: float=.95, bracket_sell_take_profit_multiplier: float=.8, bracket_sell_stop_loss_multiplier: float=1.05, position_size: float=.5, sentiment_confidence_threshold: float=.999, order_type: str='bracket', buy_limit_multiplier: float = 0.95, sell_limit_multiplier: float=1.05, limit_order_expiry: str='day'):
        self.symbol=symbol
        self.sleeptime = '24H'
        self.last_trade = None
        self.sentiment_time_to_consider = sentiment_time_to_consider
        self.cash_at_risk = cash_at_risk
        self.bracket_buy_take_profit_multiplier = bracket_buy_take_profit_multiplier
        self.bracket_buy_stop_loss_multiplier = bracket_buy_stop_loss_multiplier
        self.bracket_sell_take_profit_multiplier = bracket_sell_take_profit_multiplier
        self.bracket_sell_stop_loss_multiplier = bracket_sell_stop_loss_multiplier
        self.position_size = position_size
        self.order_type = order_type
        self.sentiment_confidence_threshold = sentiment_confidence_threshold
        self.buy_limit_multiplier = buy_limit_multiplier
        self.sell_limit_multiplier = sell_limit_multiplier
        self.limit_order_expiry = limit_order_expiry
        self.api = REST(base_url=BASE_URL, key_id=ALPACA_CREDS['API_KEY'], secret_key=ALPACA_CREDS['API_SECRET'])

    def position_sizing(self):
        cash = self.get_cash()
        last_price = self.get_last_price(self.symbol)
        quantity = math.floor(cash * self.cash_at_risk / last_price)
        return cash, last_price, quantity
    
    def get_dates(self):
        today = self.get_datetime()
        three_days_ago = today - Timedelta(days=self.sentiment_time_to_consider)
        return today.strftime('%Y-%m-%d'), three_days_ago.strftime('%Y-%m-%d')
    
    def get_sentiment(self):
        today, three_days_ago = self.get_dates()
        news = self.api.get_news(symbol=self.symbol, start=three_days_ago, end=today)
        news = [event.__dict__["_raw"]["headline"] for event in news]
        probability, sentiment = estimate_sentiment(news)
        return probability, sentiment
    
    def execute_bracket_order(self, sentiment, probability, last_price, quantity):
        if sentiment == 'positive' and probability > self.sentiment_confidence_threshold:
            if self.last_trade == 'sell':
                self.sell_all()
            order = self.create_order(self.symbol, quantity, 'buy', type='bracket', take_profit_price=last_price*self.bracket_buy_take_profit_multiplier, stop_loss_price=last_price*self.bracket_buy_stop_loss_multiplier)
            self.submit_order(order)
            self.last_trade = 'buy'
        elif sentiment == 'negative' and probability > self.sentiment_confidence_threshold:
            if self.last_trade == 'buy':
                self.sell_all()
            order = self.create_order(self.symbol, quantity, 'sell', type='bracket', take_profit_price=last_price*self.bracket_sell_take_profit_multiplier, stop_loss_price=last_price*self.bracket_sell_stop_loss_multiplier)
            self.submit_order(order)
            self.last_trade = 'sell'
    
    def execute_market_order(self, sentiment, probability, quantity):
        if sentiment == 'positive' and probability > self.sentiment_confidence_threshold:
            if self.last_trade == 'sell':
                self.sell_all()
            order = self.create_order(self.symbol, quantity, 'buy', type='market')
            self.submit_order(order)
            self.last_trade = 'buy'
        elif sentiment == 'negative' and probability > self.sentiment_confidence_threshold:
            if self.last_trade == 'buy':
                self.sell_all()
            order = self.create_order(self.symbol, quantity, 'sell', type='market')
            self.submit_order(order)
            self.last_trade = 'sell'

    def execute_limit_order(self, sentiment, probability, last_price, quantity):
        limit_price = None
        if sentiment == 'positive' and probability > self.sentiment_confidence_threshold:
            if self.last_trade == 'sell':
                self.sell_all()
            limit_price = last_price * self.buy_limit_multiplier
            order_side = 'buy'
        elif sentiment == 'negative' and probability > self.sentiment_confidence_threshold:
            if self.last_trade == 'buy':
                self.sell_all()
            limit_price = last_price * self.sell_limit_multiplier
            order_side = 'sell'

        if limit_price:
            order = self.create_order(self.symbol, quantity, order_side, type='limit', limit_price=limit_price, time_in_force=self.limit_order_expiry)
            self.submit_order(order)
            self.last_trade = order_side

    def on_trading_iteration(self):
        cash, last_price, quantity = self.position_sizing()
        probability, sentiment = self.get_sentiment()

        if cash > last_price:

            if self.order_type == 'bracket':
                self.execute_bracket_order(sentiment, probability, last_price, quantity)

            elif self.order_type == 'market':
                self.execute_market_order(sentiment, probability, quantity)

            elif self.order_type == 'limit':
                self.execute_limit_order(sentiment, probability, last_price, quantity)
           
