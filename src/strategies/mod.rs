use crate::{ExchangeApi, Candle};

pub trait Strategy {
    fn name(&self) -> &str;
    fn check_signal(&self, candles: &[Candle]) -> bool;
}

pub struct StrategyRunner {
    strategies: Vec<Box<dyn Strategy>>,
}

impl StrategyRunner {
    pub fn new() -> Self {
        Self { strategies: Vec::new() }
    }

    pub fn add_strategy(&mut self, strat: Box<dyn Strategy>) {
        self.strategies.push(strat);
    }

    pub fn run(&self, api: &dyn ExchangeApi) -> Vec<String> {
        let candles = api.fetch_candles();
        let mut triggered = Vec::new();
        for s in &self.strategies {
            if s.check_signal(&candles) {
                triggered.push(s.name().to_string());
            }
        }
        triggered
    }
}

pub mod vwap_bounce;
pub mod breakout;
