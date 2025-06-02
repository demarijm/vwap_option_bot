import unittest

from vwap_option_bot.domain import (
    TradingDomain,
    map_http_request,
    handle_domain_request,
    Action,
    DomainRequest,
)


class TestDomain(unittest.TestCase):
    def test_map_http_request_start(self):
        req = map_http_request("POST", "/api/start")
        self.assertIsNotNone(req)
        self.assertEqual(req.action, Action.START_TRADING)

    def test_handle_domain_request_start(self):
        domain = TradingDomain()
        req = DomainRequest(Action.START_TRADING)
        resp = handle_domain_request(domain, req)
        self.assertTrue(domain.trading_active)
        self.assertEqual(resp.content, "Trading started")

    def test_handle_domain_request_status(self):
        domain = TradingDomain()
        domain.start()
        req = DomainRequest(Action.STATUS)
        resp = handle_domain_request(domain, req)
        self.assertEqual(resp.content_type, "application/json")
        self.assertIn("true", resp.content)


if __name__ == "__main__":
    unittest.main()
