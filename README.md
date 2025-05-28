# VWAP Option Bot

This repository contains a Rust project that implements the foundations of a trading bot based on the Volume Weighted Average Price (VWAP) strategy. The goal is to trade same-day options when the price dips below VWAP and several red candles occur in sequence.

## Features

- Basic data structures for candles, option contracts and trade logs
- A trait (`ExchangeApi`) with a stub implementation for interacting with a broker
- Utility functions to calculate VWAP and detect three consecutive red candles
- Unit tests validating the core logic
- A step‑by‑step development plan is provided in [plan.md](plan.md)

## Getting Started

1. Ensure [Rust](https://www.rust-lang.org/tools/install) is installed.
2. Clone this repository and navigate to its directory.
3. Run the test suite to verify the project builds correctly:

   ```bash
   cargo test
   ```

The current implementation is a stub and does not place real trades. It can serve as a starting point for further development.

## Web Backtester

A minimal web interface is included using a lightweight HTTP server and [htmx](https://htmx.org/).
Start the server with:

```bash
cargo run
```

Then open `http://127.0.0.1:8080` in your browser. Click **Run Backtest** to execute a simple backtest on sample CSV data and view the strategy signals.

## Contributing

Pull requests are welcome. Please run `cargo test` before submitting changes.

