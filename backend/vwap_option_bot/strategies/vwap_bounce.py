from ..models import Candle
from ..utils import calculate_vwap, is_three_red_candles
from . import Strategy

class VwapBounce(Strategy):
    def name(self) -> str:
        return "VWAP Bounce"

    def check_signal(self, candles: list[Candle]) -> bool:
        if len(candles) < 3:
            return False
        vwap = calculate_vwap(candles)
        last_close = candles[-1].close
        return last_close < vwap and is_three_red_candles(candles)
