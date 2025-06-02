import unittest
from vwap_option_bot.models import Candle
from vwap_option_bot.strategies import StrategyRunner
from vwap_option_bot.strategies.vwap_bounce import VwapBounce
from vwap_option_bot.strategies.breakout import Breakout

class TestStrategies(unittest.TestCase):
    def test_vwap_bounce_triggered(self):
        candles = [
            Candle(timestamp=1, open=10.0, close=9.8, high=10.2, low=9.5, volume=100.0),
            Candle(timestamp=2, open=9.9, close=9.7, high=10.1, low=9.4, volume=100.0),
            Candle(timestamp=3, open=9.8, close=9.6, high=10.0, low=9.3, volume=100.0),
        ]
        strat = VwapBounce()
        self.assertTrue(strat.check_signal(candles))

    def test_vwap_bounce_not_triggered(self):
        candles = [
            Candle(timestamp=1, open=10.0, close=10.1, high=10.2, low=9.8, volume=100.0),
            Candle(timestamp=2, open=10.1, close=10.2, high=10.3, low=9.9, volume=100.0),
            Candle(timestamp=3, open=10.2, close=10.3, high=10.4, low=10.0, volume=100.0),
        ]
        strat = VwapBounce()
        self.assertFalse(strat.check_signal(candles))

    def test_breakout_triggered(self):
        candles = [
            Candle(timestamp=1, open=10.0, close=10.0, high=10.1, low=9.9, volume=100.0),
            Candle(timestamp=2, open=10.0, close=10.1, high=10.2, low=9.8, volume=100.0),
            Candle(timestamp=3, open=10.1, close=10.2, high=10.3, low=9.9, volume=100.0),
            Candle(timestamp=4, open=10.1, close=10.5, high=10.4, low=9.9, volume=100.0),
        ]
        strat = Breakout()
        self.assertTrue(strat.check_signal(candles))

    def test_breakout_not_triggered(self):
        candles = [
            Candle(timestamp=1, open=10.0, close=10.0, high=10.1, low=9.9, volume=100.0),
            Candle(timestamp=2, open=10.0, close=10.1, high=10.2, low=9.8, volume=100.0),
            Candle(timestamp=3, open=10.1, close=10.2, high=10.3, low=9.9, volume=100.0),
            Candle(timestamp=4, open=10.1, close=10.25, high=10.2, low=9.9, volume=100.0),
        ]
        strat = Breakout()
        self.assertFalse(strat.check_signal(candles))

    def test_strategy_runner(self):
        candles = [
            Candle(timestamp=1, open=10.0, close=9.8, high=10.2, low=9.5, volume=100.0),
            Candle(timestamp=2, open=9.9, close=9.7, high=10.1, low=9.4, volume=100.0),
            Candle(timestamp=3, open=9.8, close=9.6, high=10.0, low=9.3, volume=100.0),
        ]
        runner = StrategyRunner()
        runner.add_strategy(VwapBounce())
        self.assertEqual(runner.run_on_slice(candles), ["VWAP Bounce"])

if __name__ == '__main__':
    unittest.main()
