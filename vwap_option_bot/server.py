from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
import csv

from .models import Candle
from .strategies import StrategyRunner
from .strategies.vwap_bounce import VwapBounce
from .strategies.breakout import Breakout

INDEX_HTML = (Path(__file__).parent / "../static/index.html").resolve().read_text()

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

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/":
            content = INDEX_HTML.encode()
            self.send_response(200)
            self.send_header("Content-Type", "text/html")
            self.send_header("Content-Length", str(len(content)))
            self.end_headers()
            self.wfile.write(content)
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"Not Found")

    def do_POST(self):
        if self.path == "/backtest":
            results = "<br>".join(run_backtest())
            content = results.encode()
            self.send_response(200)
            self.send_header("Content-Type", "text/html")
            self.send_header("Content-Length", str(len(content)))
            self.end_headers()
            self.wfile.write(content)
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
