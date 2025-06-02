from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
import json
import threading
import time

from .domain import (
    TradingDomain,
    map_http_request,
    handle_domain_request,
)
from .models import Candle
from .strategies import StrategyRunner
from .strategies.vwap_bounce import VwapBounce
from .strategies.breakout import Breakout

INDEX_HTML = (Path(__file__).parent / "../static/index.html").resolve().read_text()

DOMAIN = TradingDomain()
TRADE_THREAD: threading.Thread | None = None


def trading_loop():
    candles = DOMAIN.load_candles("data/sample.csv")
    runner = StrategyRunner()
    runner.add_strategy(VwapBounce())
    runner.add_strategy(Breakout())
    history: list[Candle] = []
    for c in candles:
        if not DOMAIN.get_status():
            break
        history.append(c)
        triggered = runner.run_on_slice(history)
        for name in triggered:
            msg = f"{name} triggered at {c.timestamp}"
            DOMAIN.trade_logs.append(msg)
        time.sleep(0.1)
    DOMAIN.stop()


def start_trading():
    global TRADE_THREAD
    if DOMAIN.get_status():
        return
    DOMAIN.start()
    TRADE_THREAD = threading.Thread(target=trading_loop, daemon=True)
    TRADE_THREAD.start()


def stop_trading():
    DOMAIN.stop()

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
            return
        req = map_http_request("GET", self.path)
        if req:
            resp = handle_domain_request(DOMAIN, req)
            self._send(resp.content.encode(), resp.content_type)
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"Not Found")

    def do_POST(self):
        req = map_http_request("POST", self.path)
        if req:
            resp = handle_domain_request(DOMAIN, req)
            self._send(resp.content.encode(), resp.content_type)
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
