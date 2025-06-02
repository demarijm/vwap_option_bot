from ..models import Candle
from . import Strategy

class Breakout(Strategy):
    def name(self) -> str:
        return "Breakout"

    def check_signal(self, candles: list[Candle]) -> bool:
        if not candles:
            return False
        last = candles[-1]
        prev_high = max((c.high for c in candles[:-1][-5:]), default=float('-inf'))
        return last.close > prev_high
