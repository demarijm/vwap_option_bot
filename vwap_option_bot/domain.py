from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
import csv
import json

from .models import Candle
from .strategies import StrategyRunner
from .strategies.vwap_bounce import VwapBounce
from .strategies.breakout import Breakout


class Action(Enum):
    START_TRADING = "start"
    STOP_TRADING = "stop"
    BACKTEST = "backtest"
    STATUS = "status"
    LOGS = "logs"


@dataclass
class DomainRequest:
    action: Action


@dataclass
class DomainResponse:
    content: str
    content_type: str = "text/html"


class TradingDomain:
    """Simple domain layer for trading operations."""

    def __init__(self) -> None:
        self.trading_active = False
        self.trade_logs: list[str] = []

    def load_candles(self, path: str) -> list[Candle]:
        candles: list[Candle] = []
        with open(path, newline="") as f:
            reader = csv.DictReader(f)
            for row in reader:
                candles.append(
                    Candle(
                        timestamp=int(row["timestamp"]),
                        open=float(row["open"]),
                        high=float(row["high"]),
                        low=float(row["low"]),
                        close=float(row["close"]),
                        volume=float(row["volume"]),
                    )
                )
        return candles

    def run_backtest(self) -> list[str]:
        candles = self.load_candles("data/sample.csv")
        runner = StrategyRunner()
        runner.add_strategy(VwapBounce())
        runner.add_strategy(Breakout())
        history: list[Candle] = []
        logs: list[str] = []
        for c in candles:
            history.append(c)
            triggered = runner.run_on_slice(history)
            for name in triggered:
                logs.append(f"{name} triggered at {c.timestamp}")
        return logs

    def start(self) -> None:
        if not self.trading_active:
            self.trading_active = True
            self.trade_logs.append("Trading started")

    def stop(self) -> None:
        if self.trading_active:
            self.trading_active = False
            self.trade_logs.append("Trading stopped")

    def get_status(self) -> bool:
        return self.trading_active

    def get_logs(self) -> list[str]:
        return self.trade_logs


def map_http_request(method: str, path: str) -> DomainRequest | None:
    mapping = {
        ("POST", "/api/start"): Action.START_TRADING,
        ("POST", "/api/stop"): Action.STOP_TRADING,
        ("POST", "/api/backtest"): Action.BACKTEST,
        ("GET", "/api/status"): Action.STATUS,
        ("GET", "/api/logs"): Action.LOGS,
    }
    action = mapping.get((method, path))
    return DomainRequest(action) if action else None


def handle_domain_request(domain: TradingDomain, req: DomainRequest) -> DomainResponse:
    if req.action == Action.START_TRADING:
        domain.start()
        return DomainResponse("Trading started")
    if req.action == Action.STOP_TRADING:
        domain.stop()
        return DomainResponse("Trading stopped")
    if req.action == Action.BACKTEST:
        results = "<br>".join(domain.run_backtest())
        return DomainResponse(results)
    if req.action == Action.STATUS:
        status = json.dumps({"trading": domain.get_status()})
        return DomainResponse(status, "application/json")
    if req.action == Action.LOGS:
        logs = "<br>".join(domain.get_logs())
        return DomainResponse(logs)
    raise ValueError(f"Unsupported action: {req.action}")
