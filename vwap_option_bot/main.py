from . import server

def main():
    print("Starting web server at http://127.0.0.1:8080")
    server.run_server()

if __name__ == "__main__":
    main()
