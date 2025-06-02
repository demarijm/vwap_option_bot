from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
import csv
import json
import threading
import time

from .models import Candle
from .strategies import StrategyRunner
from .strategies.vwap_bounce import VwapBounce
from .strategies.breakout import Breakout

INDEX_HTML = (Path(__file__).parent / "../static/index.html").resolve().read_text()

TRADING_ACTIVE = False
TRADE_THREAD: threading.Thread | None = None
TRADE_LOGS: list[str] = []

def load_candles(path: str) -> list[Candle]:
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

def run_backtest() -> list[str]:
    candles = load_candles("data/sample.csv")
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


def trading_loop():
    global TRADING_ACTIVE
    candles = load_candles("data/sample.csv")
    runner = StrategyRunner()
    runner.add_strategy(VwapBounce())
    runner.add_strategy(Breakout())
    history: list[Candle] = []
    for c in candles:
        if not TRADING_ACTIVE:
            break
        history.append(c)
        triggered = runner.run_on_slice(history)
        for name in triggered:
            msg = f"{name} triggered at {c.timestamp}"
            TRADE_LOGS.append(msg)
        time.sleep(0.1)
    TRADING_ACTIVE = False


def start_trading():
    global TRADING_ACTIVE, TRADE_THREAD
    if TRADING_ACTIVE:
        return
    TRADING_ACTIVE = True
    TRADE_THREAD = threading.Thread(target=trading_loop, daemon=True)
    TRADE_THREAD.start()


def stop_trading():
    global TRADING_ACTIVE
    TRADING_ACTIVE = False

class Handler(BaseHTTPRequestHandler):
    def _send(self, content: bytes, content_type: str = "text/html") -> None:
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)

    def log_message(self, format: str, *args) -> None:  # pragma: no cover
        return

    def do_GET(self):
        if self.path == "/":
            content = INDEX_HTML.encode()
            self._send(content)
        elif self.path == "/api/status":
            status = json.dumps({"trading": TRADING_ACTIVE})
            self._send(status.encode(), "application/json")
        elif self.path == "/api/logs":
            logs = "<br>".join(TRADE_LOGS)
            self._send(logs.encode())
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"Not Found")

    def do_POST(self):
        if self.path == "/api/backtest":
            results = "<br>".join(run_backtest())
            self._send(results.encode())
        elif self.path == "/api/start":
            start_trading()
            self._send(b"Trading started")
        elif self.path == "/api/stop":
            stop_trading()
            self._send(b"Trading stopped")
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"Not Found")

def run_server():
    server = HTTPServer(("127.0.0.1", 8080), Handler)
    print("Server running at http://127.0.0.1:8080")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
