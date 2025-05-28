🧾 Implementation Plan: VWAP Bounce Option Bot (Rust)

🔹 Phase 1: Define Strategy & Platform
Goal: Lock in the trading rules and choose your execution platform.

✅ Tasks
- [x] Confirm trading asset: e.g., SPY, QQQ, TSLA
- [x] Confirm broker: Alpaca (easy REST, paper trading), or Interactive Brokers (more complex, supports options)
- [x] Confirm candle interval: 1-minute
- [x] Strategy logic:
  - [x] Price below VWAP
  - [x] 3 red candles in a row
  - [x] Enter same-day call option (ATM or slightly ITM)
  - [x] Use 1% of account capital

🔹 Phase 2: Set Up Rust Project
Goal: Scaffold the project and install key dependencies.

✅ Tasks
- [x] Create project:
  ```bash
  cargo new vwap_option_bot
  ```
- [x] Add dependencies to Cargo.toml:
  ```toml
  tokio = { version = "1", features = ["full"] }
  reqwest = { version = "0.11", features = ["json"] }
  serde = { version = "1", features = ["derive"] }
  serde_json = "1"
  chrono = "0.4"
  log = "0.4"
  env_logger = "0.10"
  ```

🔹 Phase 3: Market Data Fetcher
Goal: Pull real-time candles and compute VWAP.

✅ Tasks
- [x] Use REST polling or WebSockets to fetch candles
- [x] Implement Candle struct:
  ```rust
  struct Candle {
      timestamp: i64,
      open: f64,
      close: f64,
      high: f64,
      low: f64,
      volume: f64,
  }
  ```
- [x] Maintain a rolling window of candles
- [x] Compute VWAP:
  ```rust
  fn calculate_vwap(candles: &[Candle]) -> f64 {
      let (mut pv_sum, mut vol_sum) = (0.0, 0.0);
      for c in candles {
          let price = (c.high + c.low + c.close) / 3.0;
          pv_sum += price * c.volume;
          vol_sum += c.volume;
      }
      pv_sum / vol_sum
  }
  ```

🔹 Phase 4: Entry Logic
Goal: Detect the entry condition.

✅ Tasks
- [x] Implement function to detect 3 consecutive red candles:
  ```rust
  fn is_three_red_candles(candles: &[Candle]) -> bool {
      candles.iter().rev().take(3).all(|c| c.close < c.open)
  }
  ```
- [x] Check if current price is below VWAP
- [x] Log if entry signal is met

🔹 Phase 5: Trade Execution
Goal: Place paper or real trades via broker API.

✅ Tasks
- [x] Authenticate to broker (e.g., Alpaca API key/secret)
- [x] Get account balance
- [x] Find same-day option (get option chain, select strike)
- [x] Submit buy order for 1% of account value
- [x] Log response and order status

🔹 Phase 6: Risk Management
Goal: Add safety and reliability features.

✅ Tasks
- [x] Limit to 1 trade/day
- [x] Optional: set exit logic (e.g., sell at +15%, stop at -10%)
- [x] Retry API calls on failure
- [x] Add local SQLite/JSON log of all trades and decisions

🔹 Phase 7: Backtesting Engine (Optional but Useful)
Goal: Validate strategy historically on CSV candle data.

✅ Tasks
- [x] Parse CSV data (e.g., minute candles)
- [x] Reuse strategy logic
- [x] Simulate trades and output performance metrics

🔹 Phase 8: Deployment
Goal: Run this bot daily during market hours.

✅ Tasks
- [x] Host on VPS or cloud server (e.g., DigitalOcean, Fly.io)
- [x] Use systemd or tmux for uptime
- [x] Enable logging + email/slack notifications

🧭 Final Notes
| Area         | Consideration                                                                 |
|--------------|-------------------------------------------------------------------------------|
| Latency      | Rust helps a lot here, especially if you later move to WebSockets             |
| Options Data | Interactive Brokers and Tradier offer more granular option chain data         |
| Security     | Store API keys securely using .env + dotenvy                                  |
| Testing      | Use paper trading first to validate real-time execution                       |
