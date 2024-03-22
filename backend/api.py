from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from datetime import datetime, date
from pydantic import BaseModel
from lumibot.brokers import Alpaca
from lumibot.backtesting import YahooDataBacktesting
from tradebot import traderML, ALPACA_CREDS, BASE_URL

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class strategyParams(BaseModel):
    symbol: str
    cash_at_risk: float
    start_date: datetime
    end_date: datetime
    bracket_buy_take_profit_multiplier: float
    bracket_buy_stop_loss_multiplier: float
    bracket_sell_take_profit_multiplier: float
    bracket_sell_stop_loss_multiplier: float
    position_size: float
    order_type: str
    sentiment_time_to_consider: int

strategy_instance = None
broker=Alpaca(ALPACA_CREDS)

@app.post("/update_params")
def update_params(params: strategyParams):
    global strategy_instance
    if strategy_instance is None:
        strategy_instance = traderML(
            name='mlstrat', 
            broker=broker, 
            parameters={'symbol': params.symbol,
                        'cash_at_risk': params.cash_at_risk, 
                        'bracket_buy_take_profit_price': params.bracket_buy_take_profit_multiplier, 
                        'bracket_buy_stop_loss_price': params.bracket_buy_stop_loss_multiplier, 
                        'bracket_sell_take_profit_price': params.bracket_sell_take_profit_multiplier,
                        'bracket_sell_stop_loss_price': params.bracket_sell_stop_loss_multiplier,
                        'position_size': params.position_size})
    else:
        strategy_instance.parameters = {'symbol': params.symbol,
                                        'cash_at_risk': params.cash_at_risk, 
                                        'bracket_buy_take_profit_price': params.bracket_buy_take_profit_multiplier, 
                                        'bracket_buy_stop_loss_price': params.bracket_buy_stop_loss_multiplier, 
                                        'bracket_sell_take_profit_price': params.bracket_sell_take_profit_multiplier,
                                        'bracket_sell_stop_loss_price': params.bracket_sell_stop_loss_multiplier,
                                        'position_size': params.position_size}
        return {'message': 'Parameters updated'}

@app.post("/start")
def execute_bot(params: strategyParams):
    global strategy_instance
    if strategy_instance is None:
        raise HTTPException(status_code=404, detail="Bot not initialized")
    strategy_instance = traderML(name='mlstrat', broker=broker, parameters={'symbol': params.symbol,'cash_at_risk': params.cash_at_risk, 'take_profit_price': params.take_profit_multiplier, 'stop_loss_price': params.stop_loss_multiplier, 'position_size': params.position_size})
    strategy_instance.backtest(YahooDataBacktesting, params.start_date, params.end_date, parameters={'symbol': params.symbol})
