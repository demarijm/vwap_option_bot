use vwap_option_bot::server;

fn main() {
    println!("Starting web server at http://127.0.0.1:8080");
    server::run_server();
}
