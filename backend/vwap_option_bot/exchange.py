from abc import ABC, abstractmethod
from .models import Candle, OptionContract, TradeLog

class ExchangeApi(ABC):
    @abstractmethod
    def fetch_candles(self) -> list[Candle]:
        pass

    @abstractmethod
    def authenticate_broker(self) -> bool:
        pass

    @abstractmethod
    def get_account_balance(self) -> float:
        pass

    @abstractmethod
    def get_option_chain(self) -> list[OptionContract]:
        pass

    @abstractmethod
    def submit_order(self, contract: OptionContract, amount: float) -> bool:
        pass

    @abstractmethod
    def log_trade(self, trade: TradeLog) -> None:
        pass

class AlpacaApiStub(ExchangeApi):
    def fetch_candles(self) -> list[Candle]:
        return []

    def authenticate_broker(self) -> bool:
        return True

    def get_account_balance(self) -> float:
        return 10000.0

    def get_option_chain(self) -> list[OptionContract]:
        return []

    def submit_order(self, contract: OptionContract, amount: float) -> bool:
        return True

    def log_trade(self, trade: TradeLog) -> None:
        pass
