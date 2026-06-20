# Trello-like Project

This workspace contains a minimal Trello-like scaffold: a PostgreSQL database, a Node.js Fastify backend, and a React frontend skeleton. Everything is runnable with Docker Compose.

## Quick start

1. Ensure Docker is installed and running.
2. From the project root, run:

```bash
docker-compose up --build
```

3. Backend API will be at `http://localhost:4000`.

## Environment

The project uses a `.env` file at the repo root for database secrets and backend config.

Example `.env`:

```env
POSTGRES_USER=user
POSTGRES_PASSWORD=pass
POSTGRES_DB=board
DATABASE_URL=postgres://user:pass@db:5432/board
PORT=4000
```
