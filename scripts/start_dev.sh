#!/bin/bash
set -e
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT="$(dirname "$DIR")"
if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required but not installed. Please install Docker." >&2
  exit 1
fi

echo "Starting database with Docker Compose..."
docker compose -f "$ROOT/docker-compose.yml" up -d

echo "Database is running at localhost:5432"
