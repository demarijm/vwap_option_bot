#!/usr/bin/env bash
# Placeholder installation script for setting up the bot on a server
# Adjust values for your environment
set -euo pipefail

BOT_DIR=/home/botuser/vwap_option_bot
REPO_URL="https://example.com/your-repo.git"

# Install system dependencies (example for Debian/Ubuntu)
apt-get update && apt-get install -y python3 python3-venv git

# Clone repository if not already present
if [ ! -d "$BOT_DIR" ]; then
    git clone "$REPO_URL" "$BOT_DIR"
fi

cd "$BOT_DIR"
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt || true

# Copy systemd service
cp deploy/systemd/vwap_option_bot.service /etc/systemd/system/

systemctl daemon-reload
systemctl enable vwap_option_bot.service
systemctl start vwap_option_bot.service
