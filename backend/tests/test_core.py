import unittest

from vwap_option_bot.models import Candle, OptionContract, TradeLog
from vwap_option_bot.utils import calculate_vwap, is_three_red_candles
from vwap_option_bot.exchange import AlpacaApiStub

class TestCore(unittest.TestCase):
    def get_api(self):
        return AlpacaApiStub()

    def test_calculate_vwap(self):
        candles = [
            Candle(timestamp=1, open=10.0, close=9.0, high=11.0, low=8.0, volume=100.0),
            Candle(timestamp=2, open=9.0, close=8.0, high=10.0, low=7.0, volume=150.0),
        ]
        vwap = calculate_vwap(candles)
        self.assertGreater(vwap, 0.0)

    def test_is_three_red_candles_true(self):
        candles = [
            Candle(timestamp=1, open=10.0, close=9.0, high=11.0, low=8.0, volume=100.0),
            Candle(timestamp=2, open=9.0, close=8.0, high=10.0, low=7.0, volume=150.0),
            Candle(timestamp=3, open=8.0, close=7.0, high=9.0, low=6.0, volume=120.0),
        ]
        self.assertTrue(is_three_red_candles(candles))

    def test_is_three_red_candles_false(self):
        candles = [
            Candle(timestamp=1, open=10.0, close=11.0, high=12.0, low=9.0, volume=100.0),
            Candle(timestamp=2, open=11.0, close=12.0, high=13.0, low=10.0, volume=150.0),
            Candle(timestamp=3, open=12.0, close=13.0, high=14.0, low=11.0, volume=120.0),
        ]
        self.assertFalse(is_three_red_candles(candles))

    def test_fetch_candles_stub(self):
        api = self.get_api()
        candles = api.fetch_candles()
        self.assertEqual(candles, [])

    def test_authenticate_broker_stub(self):
        api = self.get_api()
        self.assertTrue(api.authenticate_broker())

    def test_get_account_balance_stub(self):
        api = self.get_api()
        balance = api.get_account_balance()
        self.assertEqual(balance, 10000.0)

    def test_get_option_chain_stub(self):
        api = self.get_api()
        chain = api.get_option_chain()
        self.assertEqual(chain, [])

    def test_submit_order_stub(self):
        api = self.get_api()
        contract = OptionContract(symbol="SPY230616C00400000", strike=400.0, expiry="2023-06-16", option_type="call")
        result = api.submit_order(contract, 100.0)
        self.assertTrue(result)

    def test_log_trade_stub(self):
        api = self.get_api()
        log = TradeLog(timestamp=1234567890, action="BUY", details="Test trade")
        api.log_trade(log)

if __name__ == '__main__':
    unittest.main()
