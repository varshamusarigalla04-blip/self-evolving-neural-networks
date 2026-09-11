"""
run_demo.py - Local Web Server & Demo Launcher
Starts a local HTTP server and automatically opens the Self-Evolving Neural Networks prototype in your default web browser.
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def run():
    os.chdir(DIRECTORY)
    # Allow port reuse to avoid 'Address already in use' errors
    socketserver.TCPServer.allow_reuse_address = True
    
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            url = f"http://localhost:{PORT}/index.html"
            print("=" * 70)
            print("🚀 Self-Evolving Neural Networks Prototype is Running!")
            print("=" * 70)
            print(f"Serving files from: {DIRECTORY}")
            print(f"Local URL:          {url}")
            print("=" * 70)
            print("Opening web browser automatically...")
            print("Press Ctrl+C in this terminal window to stop the server.")
            print("=" * 70)
            
            webbrowser.open(url)
            httpd.serve_forever()
    except OSError as e:
        print(f"Port {PORT} is busy or error occurred: {e}")
        print("Opening index.html directly via file protocol...")
        webbrowser.open(os.path.join(DIRECTORY, "index.html"))
    except KeyboardInterrupt:
        print("\nStopping server. Goodbye!")
        sys.exit(0)

if __name__ == "__main__":
    run()
