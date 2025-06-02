# VWAP Option Bot

This repository contains a Python project that implements the foundations of a trading bot based on the Volume Weighted Average Price (VWAP) strategy. The goal is to trade same-day options when the price dips below VWAP and several red candles occur in sequence.

## Features

- Basic data classes for candles, option contracts and trade logs
- An abstract `ExchangeApi` with a stub implementation for interacting with a broker
- Utility functions to calculate VWAP and detect three consecutive red candles
- Unit tests validating the core logic
- A step‑by‑step development plan is provided in [plan.md](plan.md)

## Getting Started

1. Ensure Python 3.11+ is installed.
2. Clone this repository and navigate to its directory.
3. Install dependencies (none are required for the core features).
4. Run the test suite to verify the project works correctly:

   ```bash
   python -m unittest
   ```

The current implementation is a stub and does not place real trades. It can serve as a starting point for further development.

## Web UI and API

A minimal web interface is included using Python's built‑in HTTP server and [htmx](https://htmx.org/). It exposes an API so you can start or stop the mock trading loop and run backtests.
Start the server with:

```bash
python -m vwap_option_bot.main
```

Then open `http://127.0.0.1:8080` in your browser. Use the buttons to start/stop trading or to run a backtest. The status and logs automatically refresh every few seconds.

## Contributing

Pull requests are welcome. Please run `python -m unittest` before submitting changes.

## Deployment

Example deployment files are located in the `deploy/` directory.
These include a `systemd` service definition and a GitHub Actions
workflow that copies the project to a VPS. Replace the placeholder
server details with your own values before using.
