from fastapi import FastAPI
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

strategy_instance = None
broker=Alpaca(ALPACA_CREDS)

@app.post("/update_params")
def update_params(params: strategyParams):
    global strategy_instance
    if strategy_instance is None:
        strategy_instance = traderML(name='mlstrat', broker=broker, parameters={'symbol': params.symbol,'cash_at_risk': params.cash_at_risk})

@app.post("/start")
def execute_bot(params: strategyParams):
    global strategy_instance
    strategy_instance = traderML(name='mlstrat', broker=broker, parameters={'symbol': 'SPY','cash_at_risk': .5})
    strategy_instance.backtest(YahooDataBacktesting, params.start_date, params.end_date, parameters={'symbol': params.symbol})
