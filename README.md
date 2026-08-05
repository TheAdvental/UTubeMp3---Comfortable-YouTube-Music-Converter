# 🎵 UTubeMp3 — Comfortable YouTube Music Converter

A beautiful web application for downloading music from YouTube Music, with Spotify catalog search, playlist and album browsing.

---

## ✨ Features

- 🔍 **YouTube Music search** — find songs, artists, albums
- 🎵 **Spotify search** — browse Spotify catalog and download tracks via YouTube
- 📋 **Spotify playlists & albums** — open by URL and download all tracks
- 🎤 **Artist pages** — browse discography
- 📚 **Download history** — library of all downloaded tracks
- 🏷️ **Smart naming** — files saved as `Artist - Title.mp3`

---

## 🚀 Run Locally (Windows)

```bash
# Just double-click:
run.bat
```

App opens at `http://localhost:8000`

---

## 🐳 Deploy with Docker (Linux Server)

### 1. Install Docker on your server

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# Log out and back in
```

### 2. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/UTubeMp3.git
cd UTubeMp3
```

### 3. Create `.env` file

```bash
cp .env.example .env
nano .env
```

Fill in your values:
```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://192.168.1.100:8000/api/spotify/callback
#                    ↑ use your server's local IP or public IP/domain
```

> 💡 **Get Spotify credentials**: [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
> — Create an app → note Client ID & Secret

### 4. Build and start

```bash
docker compose up -d --build
```

App is running at `http://YOUR_SERVER_IP:8000`

### 5. Set up Spotify OAuth (for playlists)

1. Go to [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Click your app → **Edit Settings**
3. Under **Redirect URIs** → Add your `SPOTIFY_REDIRECT_URI` value → **Save**
4. Open the app → click **🔗 Підключити Spotify** → authorize

### Useful commands

```bash
docker compose logs -f        # view logs
docker compose down           # stop
docker compose up -d          # start
docker compose up -d --build  # rebuild after code changes
```

Downloaded music is stored in `./data/downloads/` on the host.

---

## ⚙️ Configuration

| Env Variable | Description | Default |
|---|---|---|
| `SPOTIFY_CLIENT_ID` | Spotify app client ID | *(required)* |
| `SPOTIFY_CLIENT_SECRET` | Spotify app client secret | *(required)* |
| `SPOTIFY_REDIRECT_URI` | OAuth callback URL | `http://127.0.0.1:8000/api/spotify/callback` |
| `DOWNLOADS_DIR` | Where MP3 files are saved | `/data/downloads` |
| `DB_PATH` | SQLite database path | `/data/downloads.db` |

---

## 🛠️ Tech Stack

- **Backend**: Python, FastAPI, yt-dlp, spotipy, ytmusicapi
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Database**: SQLite
- **Container**: Docker + docker-compose