# VWAP Option Bot Monorepo

This project contains a Python backend and Next.js frontend.

## Development Database
A `docker-compose.yml` file is included to spin up a local Postgres instance.
Run the helper script to start the database:

```bash
./scripts/start_dev.sh
```

The database will be available on `localhost:5432` with the credentials
specified in `docker-compose.yml`.
