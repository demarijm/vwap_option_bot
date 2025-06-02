import unittest
from unittest.mock import patch

from vwap_option_bot import server

class TestServer(unittest.TestCase):
    def test_load_candles(self):
        candles = server.load_candles('data/sample.csv')
        self.assertEqual(len(candles), 10)
        self.assertEqual(candles[0].open, 100.0)

    def test_run_backtest(self):
        logs = server.run_backtest()
        expected = [
            'Breakout triggered at 1',
            'VWAP Bounce triggered at 5',
            'VWAP Bounce triggered at 6',
            'VWAP Bounce triggered at 7',
        ]
        self.assertEqual(logs, expected)

    def test_start_trading_creates_logs(self):
        server.TRADE_LOGS.clear()
        with patch('vwap_option_bot.server.time.sleep', return_value=None):
            server.start_trading()
            if server.TRADE_THREAD:
                server.TRADE_THREAD.join(timeout=1.0)
        self.assertFalse(server.TRADING_ACTIVE)
        self.assertGreaterEqual(len(server.TRADE_LOGS), 1)

if __name__ == '__main__':
    unittest.main()
