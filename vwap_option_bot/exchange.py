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


class InteractiveBrokersApiStub(ExchangeApi):
    """Minimal stub for Interactive Brokers."""

    def fetch_candles(self) -> list[Candle]:
        return []

    def authenticate_broker(self) -> bool:
        return True

    def get_account_balance(self) -> float:
        # Different starting balance to show provider distinction
        return 50000.0

    def get_option_chain(self) -> list[OptionContract]:
        return []

    def submit_order(self, contract: OptionContract, amount: float) -> bool:
        return True

    def log_trade(self, trade: TradeLog) -> None:
        pass


def get_exchange_api(name: str) -> ExchangeApi:
    """Return an ExchangeApi implementation based on the provider name."""
    providers = {
        "alpaca": AlpacaApiStub,
        "interactive_brokers": InteractiveBrokersApiStub,
        "ib": InteractiveBrokersApiStub,
    }
    try:
        return providers[name.lower()]()
    except KeyError:
        raise ValueError(f"Unknown provider '{name}'")


__all__ = [
    "ExchangeApi",
    "AlpacaApiStub",
    "InteractiveBrokersApiStub",
    "get_exchange_api",
]
