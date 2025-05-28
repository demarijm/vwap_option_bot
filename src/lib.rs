pub trait ExchangeApi {
    fn fetch_candles(&self) -> Vec<Candle>;
    fn authenticate_broker(&self) -> bool;
    fn get_account_balance(&self) -> f64;
    fn get_option_chain(&self) -> Vec<OptionContract>;
    fn submit_order(&self, contract: &OptionContract, amount: f64) -> bool;
    fn log_trade(&self, trade: &TradeLog);
}

pub struct AlpacaApiStub;

impl ExchangeApi for AlpacaApiStub {
    fn fetch_candles(&self) -> Vec<Candle> {
        // Stub: Replace with real API call
        vec![]
    }
    fn authenticate_broker(&self) -> bool {
        // Stub: Replace with real authentication
        true
    }
    fn get_account_balance(&self) -> f64 {
        // Stub: Replace with real API call
        10000.0
    }
    fn get_option_chain(&self) -> Vec<OptionContract> {
        // Stub: Replace with real API call
        vec![]
    }
    fn submit_order(&self, _contract: &OptionContract, _amount: f64) -> bool {
        // Stub: Replace with real order submission
        true
    }
    fn log_trade(&self, _trade: &TradeLog) {
        // Stub: Replace with real logging
    }
}

#[derive(Debug, Clone)]
pub struct Candle {
    pub timestamp: i64,
    pub open: f64,
    pub close: f64,
    pub high: f64,
    pub low: f64,
    pub volume: f64,
}

#[derive(Debug, Clone)]
pub struct OptionContract {
    pub symbol: String,
    pub strike: f64,
    pub expiry: String,
    pub option_type: String, // "call" or "put"
}

#[derive(Debug, Clone)]
pub struct TradeLog {
    pub timestamp: i64,
    pub action: String,
    pub details: String,
}

pub fn calculate_vwap(candles: &[Candle]) -> f64 {
    let (mut pv_sum, mut vol_sum) = (0.0, 0.0);
    for c in candles {
        let price = (c.high + c.low + c.close) / 3.0;
        pv_sum += price * c.volume;
        vol_sum += c.volume;
    }
    if vol_sum == 0.0 { 0.0 } else { pv_sum / vol_sum }
}

pub fn is_three_red_candles(candles: &[Candle]) -> bool {
    candles.iter().rev().take(3).all(|c| c.close < c.open)
}

pub mod strategies;
pub mod server;

#[cfg(test)]
mod tests {
    use super::*;

    fn get_api() -> Box<dyn ExchangeApi> {
        Box::new(AlpacaApiStub)
    }

    #[test]
    fn test_calculate_vwap() {
        let candles = vec![
            Candle { timestamp: 1, open: 10.0, close: 9.0, high: 11.0, low: 8.0, volume: 100.0 },
            Candle { timestamp: 2, open: 9.0, close: 8.0, high: 10.0, low: 7.0, volume: 150.0 },
        ];
        let vwap = calculate_vwap(&candles);
        assert!(vwap > 0.0);
    }

    #[test]
    fn test_is_three_red_candles_true() {
        let candles = vec![
            Candle { timestamp: 1, open: 10.0, close: 9.0, high: 11.0, low: 8.0, volume: 100.0 },
            Candle { timestamp: 2, open: 9.0, close: 8.0, high: 10.0, low: 7.0, volume: 150.0 },
            Candle { timestamp: 3, open: 8.0, close: 7.0, high: 9.0, low: 6.0, volume: 120.0 },
        ];
        assert!(is_three_red_candles(&candles));
    }

    #[test]
    fn test_is_three_red_candles_false() {
        let candles = vec![
            Candle { timestamp: 1, open: 10.0, close: 11.0, high: 12.0, low: 9.0, volume: 100.0 },
            Candle { timestamp: 2, open: 11.0, close: 12.0, high: 13.0, low: 10.0, volume: 150.0 },
            Candle { timestamp: 3, open: 12.0, close: 13.0, high: 14.0, low: 11.0, volume: 120.0 },
        ];
        assert!(!is_three_red_candles(&candles));
    }

    #[test]
    fn test_fetch_candles_stub() {
        let api = get_api();
        let candles = api.fetch_candles();
        assert!(candles.is_empty());
    }

    #[test]
    fn test_authenticate_broker_stub() {
        let api = get_api();
        assert!(api.authenticate_broker());
    }

    #[test]
    fn test_get_account_balance_stub() {
        let api = get_api();
        let balance = api.get_account_balance();
        assert_eq!(balance, 10000.0);
    }

    #[test]
    fn test_get_option_chain_stub() {
        let api = get_api();
        let chain = api.get_option_chain();
        assert!(chain.is_empty());
    }

    #[test]
    fn test_submit_order_stub() {
        let api = get_api();
        let contract = OptionContract {
            symbol: "SPY230616C00400000".to_string(),
            strike: 400.0,
            expiry: "2023-06-16".to_string(),
            option_type: "call".to_string(),
        };
        let result = api.submit_order(&contract, 100.0);
        assert!(result);
    }

    #[test]
    fn test_log_trade_stub() {
        let api = get_api();
        let log = TradeLog {
            timestamp: 1234567890,
            action: "BUY".to_string(),
            details: "Test trade".to_string(),
        };
        api.log_trade(&log);
    }
}

