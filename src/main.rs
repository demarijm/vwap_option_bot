use vwap_option_bot::strategies::{StrategyRunner, vwap_bounce::VwapBounce, breakout::Breakout};
use vwap_option_bot::{AlpacaApiStub};

fn main() {
    println!("VWAP Option Bot");
    let api = AlpacaApiStub;
    let mut runner = StrategyRunner::new();
    runner.add_strategy(Box::new(VwapBounce));
    runner.add_strategy(Box::new(Breakout));

    let results = runner.run(&api);
    for name in results {
        println!("Strategy {} triggered", name);
    }
}
