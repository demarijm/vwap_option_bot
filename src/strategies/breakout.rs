use crate::Candle;

pub struct Breakout;

impl super::Strategy for Breakout {
    fn name(&self) -> &str {
        "Breakout"
    }

    fn check_signal(&self, candles: &[Candle]) -> bool {
        if candles.is_empty() {
            return false;
        }
        let last = candles.last().unwrap();
        let prev_high = candles.iter().rev().skip(1).take(5)
            .fold(f64::MIN, |max, c| max.max(c.high));
        last.close > prev_high
    }
}
