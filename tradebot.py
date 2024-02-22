import os
from dotenv import load_dotenv
from lumibot.brokers import Alpaca
from lumibot.backtesting import YahooDataBacktesting
from lumibot.strategies.strategy import Strategy
from lumibot.traders import Trader
from datetime import datetime

load_dotenv()

BASE_URL = 'https://paper-api.alpaca.markets'

ALPACA_CREDS = {
    'API_KEY': os.getenv('API_KEY'),
    'API_SECRET': os.getenv('API_SECRET'),
    'PAPER': True,
}

class traderML(Strategy):
    def initialize(self, symbol:str='SPY'):
        self.symbol=symbol
        self.sleeptime = '24H'
        self.last_trade = None

    def on_trading_iteration(self):
        if self.last_trade == None:
            order = self.create_order(self.symbol, 10, 'buy', type='market')
            self.submit_order(order)
            self.last_trade = 'buy'

start_date = datetime(2023, 12, 15)
end_date = datetime(2023, 12, 31)

broker = Alpaca(ALPACA_CREDS)

strategy = traderML(name='mlstrat', broker=broker, parameters={'symbol': 'SPY'})

strategy.backtest(
    YahooDataBacktesting,
    start_date,
    end_date,
    parameters={'symbol': 'SPY'}
)

