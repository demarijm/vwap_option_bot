from abc import ABC, abstractmethod
from ..models import Candle
from ..exchange import ExchangeApi

class Strategy(ABC):
    @abstractmethod
    def name(self) -> str:
        pass

    @abstractmethod
    def check_signal(self, candles: list[Candle]) -> bool:
        pass

class StrategyRunner:
    def __init__(self):
        self.strategies: list[Strategy] = []

    def add_strategy(self, strategy: Strategy) -> None:
        self.strategies.append(strategy)

    def run(self, api: ExchangeApi) -> list[str]:
        candles = api.fetch_candles()
        return [s.name() for s in self.strategies if s.check_signal(candles)]

    def run_on_slice(self, candles: list[Candle]) -> list[str]:
        return [s.name() for s in self.strategies if s.check_signal(candles)]
