use crate::{calculate_vwap, is_three_red_candles, Candle};

pub struct VwapBounce;

impl super::Strategy for VwapBounce {
    fn name(&self) -> &str {
        "VWAP Bounce"
    }

    fn check_signal(&self, candles: &[Candle]) -> bool {
        if candles.len() < 3 {
            return false;
        }
        let vwap = calculate_vwap(&candles);
        let last_close = candles.last().unwrap().close;
        last_close < vwap && is_three_red_candles(&candles)
    }
}
