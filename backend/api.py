from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from datetime import datetime, date
from pydantic import BaseModel
from lumibot.brokers import Alpaca
from lumibot.backtesting import YahooDataBacktesting
from tradebot import traderML, ALPACA_CREDS, BASE_URL
from typing import Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class strategyParams(BaseModel):
    symbol: Optional[str] = None
    cash_at_risk: Optional[float] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    bracket_buy_take_profit_multiplier: Optional[float] = None
    bracket_buy_stop_loss_multiplier: Optional[float] = None
    bracket_sell_take_profit_multiplier: Optional[float] = None
    bracket_sell_stop_loss_multiplier: Optional[float] = None
    position_size: Optional[float] = None
    order_type: Optional[str] = None
    buy_limit_multiplier: Optional[float] = None
    sell_limit_multiplier: Optional[float] = None
    limit_order_expiry: Optional[str] = None
    sentiment_time_to_consider: Optional[int] = None
    sentiment_confidence_threshold: Optional[float] = None

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
                        'start_date': params.start_date,
                        'end_date': params.end_date,
                        'bracket_buy_take_profit_price': params.bracket_buy_take_profit_multiplier, 
                        'bracket_buy_stop_loss_price': params.bracket_buy_stop_loss_multiplier, 
                        'bracket_sell_take_profit_price': params.bracket_sell_take_profit_multiplier,
                        'bracket_sell_stop_loss_price': params.bracket_sell_stop_loss_multiplier,
                        'position_size': params.position_size,
                        'order_type': params.order_type,
                        'buy_limit_multiplier': params.buy_limit_multiplier,
                        'sell_limit_multiplier': params.sell_limit_multiplier,
                        'limit_order_expiry': params.limit_order_expiry,
                        'sentiment_time_to_consider': params.sentiment_time_to_consider,
                        'sentiment_confidence_threshold': params.sentiment_confidence_threshold})
    else:
        for var_name, value in vars(params).items():
            if value is not None:
                setattr(strategy_instance, var_name, value)
    
    return {'message': 'Parameters updated'}

@app.post("/start")
def execute_bot(params: strategyParams):
    global strategy_instance
    if strategy_instance is None:
        raise HTTPException(status_code=404, detail="Bot not initialized")
    
    
    strategy_instance = traderML(name='mlstrat', broker=broker, parameters={'symbol': params.symbol,'cash_at_risk': params.cash_at_risk, 'bracket_buy_take_profit_price': params.bracket_buy_take_profit_multiplier, 'bracket_buy_stop_loss_price': params.bracket_buy_stop_loss_multiplier, 'bracket_sell_take_profit_multiplier': params.bracket_sell_take_profit_multiplier, 'bracket_sell_stop_loss_multiplier': params.bracket_sell_stop_loss_multiplier, 'position_size': params.position_size,'order_type': params.order_type,
                        'buy_limit_multiplier': params.buy_limit_multiplier,
                        'sell_limit_multiplier': params.sell_limit_multiplier,
                        'limit_order_expiry': params.limit_order_expiry,
                        'sentiment_time_to_consider': params.sentiment_time_to_consider,
                        'sentiment_confidence_threshold': params.sentiment_confidence_threshold})
    strategy_instance.backtest(YahooDataBacktesting, params.start_date, params.end_date, parameters={'symbol': params.symbol})
