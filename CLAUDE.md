# UTubeMp3 — Comfortable YouTube Music Converter

## Project Overview

A web app for downloading YouTube Music tracks and albums as MP3 files, with optional Spotify search (Spotify tracks are resolved to YouTube Music and downloaded from there).
**Stack:** FastAPI (Python) backend + Vanilla HTML/CSS/JS frontend, SQLite for history, yt-dlp + FFmpeg (+ Deno/Node.js for YouTube JS challenges) for conversion.

**One codebase, two deployment profiles.** `backend/` and `frontend/` are shared; the profiles differ only in launch scripts and environment variables. Never fork code per profile: add a setting in `backend/config.py` instead.
- **Local (Windows)**: `local\run.bat`, config in `<root>/.env`, serves at `http://127.0.0.1:8000`
- **Docker (server)**: `docker/`, config in `docker/.env`, data in the `utube_data` named volume

---

## Project Structure

```
.
├── backend/
│   ├── app.py              # FastAPI entry point, /api/health, /api/config, static mount
│   ├── config.py           # ALL settings (env vars + <root>/.env loader), JS runtime / cookies detection
│   ├── api/
│   │   ├── youtube.py      # YouTube Music search/metadata endpoints
│   │   ├── downloader.py   # Download queue, progress, history, file streaming
│   │   └── spotify.py      # Spotify search/albums/playlists/OAuth + resolve to YouTube
│   └── db/
│       └── database.py     # SQLAlchemy model + SQLite engine
├── frontend/               # index.html, app.js, style.css, placeholder.svg
├── local/                  # Local profile: install.bat, run.bat
├── docker/                 # Docker profile: Dockerfile, docker-compose.yml, .env.example
├── .env.example            # Local profile config template (copied to .env by install.bat)
├── .dockerignore           # Build context is the repo root; only backend/, frontend/, requirements.txt
├── smoke_test.py           # Stdlib-only smoke test against a running instance
└── requirements.txt
```

Ignored, local-only: `venv/`, `downloads/`, `downloads.db`, `.env`, `docker/.env`, `cookies.txt`.

---

## Backend API (`/api`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | `ffmpeg`, `js_runtime`, `cookies`, `app_env`: environment diagnostics + Docker healthcheck |
| GET | `/config` | Profile flags for the frontend (`auto_browser_download`, `show_file_paths`) |
| GET | `/youtube/search?query=&filter=` | `filter`: `artists`, `songs`, `albums` |
| GET | `/youtube/song/{video_id}` | Metadata for one song (used by "search by URL") |
| GET | `/youtube/artist/{browse_id}` | Artist info, songs, albums, singles + browseId/params for full lists |
| GET | `/youtube/artist/{browse_id}/albums?params=` | Full album or singles list |
| GET | `/youtube/album/{browse_id}` | Album tracks |
| GET | `/youtube/playlist/{browse_id}` | Playlist tracks (limit 100) |
| POST | `/downloader/download?video_id=&title=&artist=&thumbnail=` | Queue a download (title/artist/thumbnail optional) |
| GET | `/downloader/progress/{video_id}` | `queued` / `starting` / `downloading` / `converting` / `completed` / `error` / `unknown` |
| GET | `/downloader/history` | Library, newest first (incl. `file_exists`, `file_name`) |
| GET | `/downloader/file/{video_id}` | Stream the MP3 to the browser |
| DELETE | `/downloader/history` | Body `{"video_ids": [...]}`: deletes records + MP3 files |
| GET | `/spotify/auth-status` | `configured`, `logged_in`, `redirect_uri`, `app_base_url` |
| GET | `/spotify/search`, `/album/{id}`, `/artist/{id}`, `/playlist/{id}`, `/resolve` | Spotify catalog; playlists need OAuth (`/login` → `/callback`) |

### Download flow
1. `POST /download` validates `video_id`, skips if already in the DB **and** the file exists, reserves the id in `download_progress` (prevents double starts).
2. Background task waits for a slot (`MAX_CONCURRENT_DOWNLOADS` semaphore) and opens **its own** DB session (the request session is closed by then).
3. yt-dlp (with `js_runtimes` + optional `cookiefile`) downloads best audio, FFmpeg converts to MP3 192 kbps → `DOWNLOADS_DIR/{artist} - {title}.mp3` (adds ` [video_id]` on name clash).
4. Upsert into `downloaded_songs`, write ID3 tags (TIT2, TPE1, TPE2).

---

## Configuration (`backend/config.py`)

| Variable | Local default | Docker default |
|----------|---------------|----------------|
| `APP_ENV` | `local` | `docker` |
| `DOWNLOADS_DIR` / `DB_PATH` | `<root>/downloads`, `<root>/downloads.db` | `/data/downloads`, `/data/downloads.db` |
| `AUTO_BROWSER_DOWNLOAD` | `false` | `true` |
| `MAX_CONCURRENT_DOWNLOADS` | `3` | `3` |
| `YTDLP_JS_RUNTIME` | auto: deno → node → bun on PATH | deno (in image) |
| `YTDLP_COOKIES_FILE` | `<root>/cookies.txt` if present | `/data/cookies.txt` if present |
| `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` | empty (Spotify disabled) | empty |
| `APP_BASE_URL` / `SPOTIFY_REDIRECT_URI` | `http://127.0.0.1:8000` / derived | same |

`<root>/.env` is loaded by `config.py` without overriding real env vars. **Never hardcode secrets** in code.

---

## Running

```bat
:: Local (Windows)
local\install.bat
local\run.bat

:: Manual (from repo root)
venv\Scripts\activate
cd backend
python -m uvicorn app:app --host 127.0.0.1 --port 8000
```

```bash
# Docker (from repo root)
docker compose -f docker/docker-compose.yml up -d --build
docker compose -f docker/docker-compose.yml --profile ngrok up -d   # + HTTPS tunnel for Spotify OAuth
docker logs utube-mp3 -f
```

## Testing

```bash
python smoke_test.py                         # against http://127.0.0.1:8000
python smoke_test.py http://host:8000 --download   # also downloads/deletes one track
```

---

## Key Patterns & Gotchas

- **YouTube needs a JS runtime.** Without Deno/Node.js, yt-dlp falls back to clients YouTube answers with **HTTP 403**. `requirements.txt` uses `yt-dlp[default]` (pulls `yt-dlp-ejs`). Keep yt-dlp current: `run.bat` upgrades it on each start; Docker gets it on rebuild.
- **"Sign in to confirm you're not a bot" / HTTP 429** = YouTube rate-limited the IP (also happens after many test downloads). Not a code bug; wait or use cookies.
- **Single worker only**: `download_progress` is in memory. It resets on restart (frontend gives up after 5 `unknown` polls).
- **Spotify OAuth**: Spotify accepts `http://` only for `127.0.0.1` (not `localhost`); remote access needs HTTPS (ngrok profile). The callback redirects to `APP_BASE_URL/#spotify`, which the frontend handles on load. Spotipy uses `MemoryCacheHandler`, so no `.cache` token files.
- **Frontend**: always pass YouTube/Spotify strings through `escapeHtml()` before `innerHTML`; attach handlers with `addEventListener`, not inline `onclick` with string interpolation.
- **Docker image** runs as uid 1000; a bind-mounted `DATA_PATH` must be writable by that uid.
- **Frontend is served as static files** via FastAPI's `StaticFiles` mount at `/` (mounted last, after API routes). Bump `?v=` in `index.html` when changing js/css.
