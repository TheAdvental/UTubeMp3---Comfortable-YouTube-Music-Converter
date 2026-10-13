# UTubeMp3 - Comfortable YouTube Music Converter

***"Good morning, afternoon, or evening. This is a solution to my painful problem (downloading music) vibecoded in an hour. I needed to solve the problem of downloading large volumes of music as quickly as possible, so I added the ability to download entire albums at once. I hope this site will be as useful to someone else as it was to me."***

---

## Project Structure

```
.
|-- backend/          # Shared FastAPI backend (used by both profiles)
|-- frontend/         # Shared HTML/CSS/JS frontend
|-- local/            # Local Windows profile
|   |-- install.bat   # One-time setup
|   |-- run.bat       # Run the server locally
|   `-- .env.local    # Local environment config (gitignored)
|-- docker/           # Docker/server profile
|   |-- Dockerfile
|   |-- docker-compose.yml
|   `-- .env.example  # Copy to .env and fill in your values
`-- requirements.txt
```

---

## Running Locally (Windows)

### Prerequisites
1. **Python 3.10+** installed
2. **FFmpeg** installed and available in your PATH
   - Install via winget: `winget install Gyan.FFmpeg`

### Setup (first time only)
Double-click: `local\install.bat`

### Run
Double-click: `local\run.bat`

The browser opens automatically at http://localhost:8000.

---

## Running in Docker (Server)

### Prerequisites
- Docker and Docker Compose installed on the server

### Setup
```bash
# 1. Copy the env template
cp docker/.env.example docker/.env

# 2. Build and start the container
docker compose -f docker/docker-compose.yml up -d --build
```

The app will be available at `http://<your-server-ip>:8000`.

Downloaded MP3s and the SQLite database are stored in a persistent Docker volume (utube_data).

### Stop
```bash
docker compose -f docker/docker-compose.yml down
```

### Logs
```bash
docker logs utube-mp3 -f
```

---

*(All converted MP3s appear in the downloads folder - locally, or inside the Docker volume on the server.)*