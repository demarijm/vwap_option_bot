from .models import Candle

def calculate_vwap(candles: list[Candle]) -> float:
    pv_sum = 0.0
    vol_sum = 0.0
    for c in candles:
        price = (c.high + c.low + c.close) / 3.0
        pv_sum += price * c.volume
        vol_sum += c.volume
    return pv_sum / vol_sum if vol_sum else 0.0

def is_three_red_candles(candles: list[Candle]) -> bool:
    if len(candles) < 3:
        return False
    return all(c.close < c.open for c in candles[-3:])
