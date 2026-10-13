# UTubeMp3 — Comfortable YouTube Music Converter

## Project Overview

A web app for downloading YouTube Music tracks and albums as MP3 files.  
**Stack:** FastAPI (Python) backend + Vanilla HTML/CSS/JS frontend, SQLite for history, yt-dlp + FFmpeg for conversion.

Two deployment profiles:
- **Local (Windows)** — runs via `run.bat`, serves at `http://localhost:8000`
- **Docker (Server)** — runs via `docker compose`, data persisted in a named volume

---

## Project Structure

```
.
├── backend/
│   ├── app.py              # FastAPI app entry point
│   ├── api/
│   │   ├── youtube.py      # YouTube Music search/metadata endpoints
│   │   └── downloader.py   # Download, progress tracking, history endpoints
│   └── db/
│       └── database.py     # SQLAlchemy models + SQLite engine
├── frontend/
│   ├── index.html
│   ├── app.js
│   └── style.css
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── .env.example
├── downloads/              # Output folder for MP3 files (local)
├── downloads.db            # SQLite DB (local)
├── requirements.txt
├── run.bat                 # One-click local runner (recreates venv if needed)
└── install.bat             # First-time setup script
```

---

## Backend API

### Base URL
`http://localhost:8000/api`

### Routes

#### `/api/youtube`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/search?query=&filter=` | Search artists, songs, albums. `filter`: `artists`, `songs`, `albums` |
| GET | `/song/{video_id}` | Get metadata for a specific song |
| GET | `/artist/{browse_id}` | Get artist info + albums/songs/singles |
| GET | `/artist/{browse_id}/albums?params=` | Get full album list for an artist |
| GET | `/album/{browse_id}` | Get tracks for an album |
| GET | `/playlist/{browse_id}` | Get tracks from a playlist (limit 100) |

#### `/api/downloader`
| Method | Path | Description |
|--------|------|-------------|
| POST | `/download?video_id=&title=&artist=&thumbnail=` | Start background download |
| GET | `/progress/{video_id}` | Poll download progress |
| GET | `/history` | Get all downloaded songs (ordered newest first) |
| DELETE | `/history` | Delete songs by `video_ids` list (also removes MP3 files) |

### Download Flow
1. `POST /api/downloader/download` — triggers a FastAPI `BackgroundTask`
2. `yt-dlp` downloads best audio → FFmpeg converts to MP3 @ 192kbps
3. File saved as `{title} - {artist}.mp3` in `DOWNLOADS_DIR`
4. Progress tracked in-memory via `download_progress` dict (keyed by `video_id`)
5. On completion, song is upserted into `downloaded_songs` SQLite table

---

## Database

**Engine:** SQLite via SQLAlchemy  
**Model:** `DownloadedSong`

| Column | Type | Notes |
|--------|------|-------|
| `id` | Integer PK | Auto |
| `video_id` | String | Unique, indexed |
| `title` | String | Indexed |
| `artist` | String | |
| `file_path` | String | Absolute path to MP3 |
| `thumbnail` | String | Nullable, thumbnail URL |
| `downloaded_at` | DateTime | Defaults to `utcnow` |

**Path resolution:** `DB_PATH` env var (Docker) → project root `downloads.db` (local).  
**Downloads dir:** `DOWNLOADS_DIR` env var (Docker) → project root `downloads/` (local).

---

## Environment Variables

| Variable | Used in | Description |
|----------|---------|-------------|
| `DOWNLOADS_DIR` | `downloader.py` | Path to save MP3 files |
| `DB_PATH` | `database.py` | Path to SQLite database file |

See `docker/.env.example` for Docker-specific values.

---

## Running Locally (Windows)

### Prerequisites
- **Python 3.10+** in PATH
- **FFmpeg** in PATH (`winget install Gyan.FFmpeg`)

### First run
```bat
install.bat
```

### Subsequent runs
```bat
run.bat
```
> `run.bat` auto-recreates the venv if Python was moved/updated.  
> Opens `http://localhost:8000` in the browser automatically.

### Manual run (from repo root)
```bat
venv\Scripts\activate
cd backend
python -m uvicorn app:app --host 127.0.0.1 --port 8000
```

---

## Running in Docker

```bash
# First time: copy env template and fill in values
cp docker/.env.example docker/.env

# Build and start
docker compose -f docker/docker-compose.yml up -d --build

# Logs
docker logs utube-mp3 -f

# Stop
docker compose -f docker/docker-compose.yml down
```

Data (MP3s + DB) are stored in the `utube_data` Docker volume.

---

## Dependencies

```
fastapi
uvicorn[standard]
ytmusicapi       # YouTube Music API wrapper (no auth needed for search)
yt-dlp           # YouTube downloader
sqlalchemy       # ORM for SQLite
aiofiles         # Async file I/O (used by FastAPI static files)
```

---

## Key Patterns & Gotchas

- **CORS** is fully open (`allow_origins=["*"]`). Fine for local/self-hosted use.
- **Progress tracking** is in-memory (`download_progress` dict). It resets on server restart and is not thread-safe for multi-worker deployments — use single worker.
- **Duplicate check:** before downloading, backend queries DB by `video_id`. If already exists, returns early without re-downloading.
- **Filename sanitization:** strips `<>:"/\|?*` from title/artist before writing to disk.
- **Frontend is served as static files** via FastAPI's `StaticFiles` mount at `/`.
- **SQLAlchemy `check_same_thread=False`** is required for SQLite with FastAPI's background tasks.
- The `ytmusicapi` `YTMusic()` instance is created once at module import (no authentication required for public search).

---

## Testing

```bash
# Quick API smoke test
python test_api.py

# yt-dlp connectivity test
python test_yt.py
```
