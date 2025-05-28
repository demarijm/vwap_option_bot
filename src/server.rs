use std::fs;
use std::io::{Read, Write};
use std::net::{TcpListener, TcpStream};
use std::thread;

use crate::strategies::StrategyRunner;
use crate::strategies::vwap_bounce::VwapBounce;
use crate::strategies::breakout::Breakout;
use crate::Candle;

const INDEX_HTML: &str = include_str!("../static/index.html");

pub fn run_server() {
    let listener = TcpListener::bind("127.0.0.1:8080").expect("failed to bind");
    println!("Server running at http://127.0.0.1:8080");
    for stream in listener.incoming() {
        match stream {
            Ok(stream) => {
                thread::spawn(|| {
                    handle_connection(stream);
                });
            }
            Err(e) => eprintln!("Connection failed: {}", e),
        }
    }
}

fn handle_connection(mut stream: TcpStream) {
    let mut buffer = [0; 1024];
    if let Ok(size) = stream.read(&mut buffer) {
        let request = String::from_utf8_lossy(&buffer[..size]);
        let first_line = request.lines().next().unwrap_or("");
        let mut parts = first_line.split_whitespace();
        let method = parts.next().unwrap_or("");
        let path = parts.next().unwrap_or("/");

        match (method, path) {
            ("GET", "/") => serve_index(&mut stream),
            ("POST", "/backtest") => serve_backtest(&mut stream),
            _ => serve_not_found(&mut stream),
        }
    }
}

fn serve_index(stream: &mut TcpStream) {
    let response = format!(
        "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nContent-Length: {}\r\n\r\n{}",
        INDEX_HTML.len(),
        INDEX_HTML
    );
    let _ = stream.write_all(response.as_bytes());
}

fn serve_not_found(stream: &mut TcpStream) {
    let body = "Not Found";
    let response = format!(
        "HTTP/1.1 404 NOT FOUND\r\nContent-Type: text/plain\r\nContent-Length: {}\r\n\r\n{}",
        body.len(),
        body
    );
    let _ = stream.write_all(response.as_bytes());
}

fn serve_backtest(stream: &mut TcpStream) {
    let results = run_backtest();
    let body = results.join("<br>");
    let response = format!(
        "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nContent-Length: {}\r\n\r\n{}",
        body.len(),
        body
    );
    let _ = stream.write_all(response.as_bytes());
}

fn run_backtest() -> Vec<String> {
    let candles = load_candles("data/sample.csv");
    let mut runner = StrategyRunner::new();
    runner.add_strategy(Box::new(VwapBounce));
    runner.add_strategy(Box::new(Breakout));
    let mut history: Vec<Candle> = Vec::new();
    let mut logs = Vec::new();
    for c in candles {
        history.push(c.clone());
        let triggered = runner.run_on_slice(&history);
        for name in triggered {
            logs.push(format!("{} triggered at {}", name, c.timestamp));
        }
    }
    logs
}

fn load_candles(path: &str) -> Vec<Candle> {
    let data = fs::read_to_string(path).expect("csv not found");
    data.lines()
        .skip(1)
        .filter_map(|line| {
            let parts: Vec<&str> = line.split(',').collect();
            if parts.len() != 6 { return None; }
            Some(Candle {
                timestamp: parts[0].parse().ok()?,
                open: parts[1].parse().ok()?,
                high: parts[2].parse().ok()?,
                low: parts[3].parse().ok()?,
                close: parts[4].parse().ok()?,
                volume: parts[5].parse().ok()?,
            })
        })
        .collect()
}

