# 🎵 UTubeMp3 — Comfortable YouTube Music Converter

A web app for downloading music from YouTube Music as MP3, with optional Spotify catalog search (Spotify tracks are matched to YouTube Music and downloaded from there).

## ✨ Features

- 🔍 **YouTube Music search**: songs, artists, albums, or paste a link
- 🎤 **Artist pages**: tracks, albums and singles
- 💿 **Albums**: download a whole album, or select several tracks
- 🎵 **Spotify** *(optional)*: search, open albums/playlists by link, download via YouTube Music
- 📚 **My Music**: library of downloaded tracks; save to device, re-download, delete
- 🏷️ Files named `Artist - Title.mp3`, 192 kbps, with ID3 tags
- 🌐 English / Ukrainian UI

The same code runs in two ways:

| | **Local (Windows)** | **Docker (server)** |
|---|---|---|
| Start | `local\run.bat` | `docker compose -f docker/docker-compose.yml up -d --build` |
| Settings | `.env` in the project root | `docker/.env` |
| MP3 files | `downloads\` folder | `/data/downloads` in the `utube_data` volume |
| After a download | file is in `downloads\` | browser also downloads the MP3 to your device |

---

## 🖥️ Local (Windows)

### Requirements

```bat
winget install Python.Python.3.12
winget install Gyan.FFmpeg
winget install DenoLand.Deno
```

- **Python 3.10+**
- **FFmpeg**: converts audio to MP3
- **Deno** *(or Node.js)*: yt-dlp needs a JavaScript runtime to solve YouTube's challenges. **Without it YouTube refuses downloads with `HTTP Error 403`.** If Node.js is already installed, that works too.

Reopen the terminal/Explorer window after installing so the new PATH is picked up.

### Install & run

1. Double-click **`local\install.bat`** (once). It creates `venv\` and `.env`.
2. Double-click **`local\run.bat`**. The app opens at <http://127.0.0.1:8000>.

`run.bat` rebuilds the venv by itself if Python was moved or updated, and updates `yt-dlp` on every start (YouTube changes often, and an outdated yt-dlp is the most common reason downloads stop working).

---

## 🐳 Docker (server)

The image includes FFmpeg and Deno, so nothing else is needed on the host.

```bash
git clone https://github.com/TheAdvental/UTubeMp3---Comfortable-YouTube-Music-Converter.git utube
cd utube

cp docker/.env.example docker/.env     # optional: Spotify, port, etc.
docker compose -f docker/docker-compose.yml up -d --build
```

The app runs at `http://SERVER_IP:8000`.

```bash
docker compose -f docker/docker-compose.yml logs -f          # logs
docker compose -f docker/docker-compose.yml down             # stop
docker compose -f docker/docker-compose.yml up -d --build    # update after git pull (also updates yt-dlp)
```

**Data** (MP3s + database) lives in the `utube-mp3_utube_data` volume. To keep it in a host folder instead, set `DATA_PATH=./data` in `docker/.env` and create the folder with `mkdir -p docker/data && sudo chown 1000:1000 docker/data` (the container runs as uid 1000).

Rebuild the image every now and then (`up -d --build`) to get a fresh yt-dlp.

---

## 🍪 YouTube cookies (if downloads fail with "Sign in to confirm you're not a bot")

YouTube sometimes blocks an IP for a while, especially servers or after many downloads in a row (errors mentioning *bot*, or HTTP 429). Waiting usually helps. If it keeps happening, give yt-dlp cookies from a logged-in browser:

1. Export YouTube cookies in Netscape format (see [yt-dlp: exporting YouTube cookies](https://github.com/yt-dlp/yt-dlp/wiki/Extractors#exporting-youtube-cookies)). Using a secondary Google account is recommended.
2. Put the file at:
   - **Local:** `cookies.txt` in the project root
   - **Docker:** `docker cp cookies.txt utube-mp3:/data/cookies.txt && docker restart utube-mp3`

The file is picked up automatically; `/api/health` shows `"cookies": true`. `cookies.txt` is in `.gitignore`. **Never commit it**: it gives access to your Google account.

---

## 🎵 Spotify (optional)

1. Create an app at <https://developer.spotify.com/dashboard> and copy its Client ID and Client Secret.
2. Put them into `.env` (local) or `docker/.env` (Docker):
   ```env
   SPOTIFY_CLIENT_ID=...
   SPOTIFY_CLIENT_SECRET=...
   ```
3. Restart the app. Search, albums and artists work right away.
4. **Playlists** need a one-time "Connect Spotify" login. In the Spotify app settings add the Redirect URI shown in the app's Spotify tab:
   - **Local:** `http://127.0.0.1:8000/api/spotify/callback` (Spotify no longer accepts `localhost`; open the app at `127.0.0.1`)
   - **Docker, other devices:** Spotify requires HTTPS here. Use the built-in ngrok tunnel: set `NGROK_AUTHTOKEN`, `NGROK_DOMAIN` and `APP_BASE_URL=https://<NGROK_DOMAIN>` in `docker/.env`, then start with `--profile ngrok`.

---

## ⚙️ Configuration

| Variable | Default (local / Docker) | Description |
|---|---|---|
| `DOWNLOADS_DIR` | `downloads\` / `/data/downloads` | Where MP3 files are saved |
| `DB_PATH` | `downloads.db` / `/data/downloads.db` | SQLite database |
| `AUTO_BROWSER_DOWNLOAD` | `false` / `true` | Also send each finished MP3 to the browser |
| `MAX_CONCURRENT_DOWNLOADS` | `3` | Parallel downloads; the rest wait in a queue |
| `YTDLP_JS_RUNTIME` | auto (`deno`, `node`, `bun`) | Force a JS runtime, e.g. `node` |
| `YTDLP_COOKIES_FILE` | `cookies.txt` / `/data/cookies.txt` if present | YouTube cookies file |
| `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` | empty | Spotify app credentials |
| `APP_BASE_URL` | `http://127.0.0.1:8000` | Public URL, used for the Spotify OAuth redirect |
| `PORT`, `DATA_PATH` | `8000`, named volume | Docker only: host port / data location |

## 🩺 Troubleshooting

- **Check the environment:** open <http://127.0.0.1:8000/api/health>. It should show `"ffmpeg": true` and a `js_runtime`.
- **Smoke test** (any Python, no venv needed): `python smoke_test.py [URL] [--download]`
- **`HTTP Error 403`**: no Deno/Node.js found, or yt-dlp is outdated (restart `run.bat` / rebuild the image).
- **"Sign in to confirm you're not a bot" / 429**: see [YouTube cookies](#-youtube-cookies-if-downloads-fail-with-sign-in-to-confirm-youre-not-a-bot).

## 🛠️ Tech stack

FastAPI · yt-dlp + FFmpeg · ytmusicapi · spotipy · SQLite/SQLAlchemy · vanilla HTML/CSS/JS · Docker
