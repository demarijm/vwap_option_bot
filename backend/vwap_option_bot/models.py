from dataclasses import dataclass

@dataclass
class Candle:
    timestamp: int
    open: float
    close: float
    high: float
    low: float
    volume: float

@dataclass
class OptionContract:
    symbol: str
    strike: float
    expiry: str
    option_type: str  # "call" or "put"

@dataclass
class TradeLog:
    timestamp: int
    action: str
    details: str
