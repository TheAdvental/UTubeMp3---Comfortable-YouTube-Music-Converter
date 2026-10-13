"""Central configuration.

All settings come from environment variables. For the local (Windows) profile
they are read from `.env` in the project root; in Docker they are passed in by
docker-compose from `docker/.env`. Real environment variables always win.
"""
import os
import shutil

_project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def _load_dotenv(path: str):
    """Minimal .env loader (KEY=VALUE lines, # comments). Doesn't override existing env vars."""
    if not os.path.isfile(path):
        return
    with open(path, encoding="utf-8-sig") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            key, value = key.strip(), value.strip().strip('"').strip("'")
            os.environ.setdefault(key, value)


_load_dotenv(os.path.join(_project_root, ".env"))


def _bool(name: str, default: bool) -> bool:
    value = os.getenv(name)
    if value is None or value == "":
        return default
    return value.strip().lower() in ("1", "true", "yes", "on")


# ── Deployment profile ─────────────────────────────────────────────────────────
# "local" (Windows, run.bat) or "docker" (server). Only affects defaults below.
APP_ENV = os.getenv("APP_ENV", "local").lower()
IS_DOCKER = APP_ENV == "docker"

# ── Data paths ─────────────────────────────────────────────────────────────────
DOWNLOADS_DIR = os.path.abspath(os.getenv("DOWNLOADS_DIR") or os.path.join(_project_root, "downloads"))
DB_PATH = os.path.abspath(os.getenv("DB_PATH") or os.path.join(_project_root, "downloads.db"))

# ── Downloads ──────────────────────────────────────────────────────────────────
# After a track is converted, also push the MP3 to the browser ("Save as").
# Useful on a server (files live on another machine); pointless locally,
# where the MP3 already sits in the downloads/ folder.
AUTO_BROWSER_DOWNLOAD = _bool("AUTO_BROWSER_DOWNLOAD", default=IS_DOCKER)

# How many yt-dlp/FFmpeg jobs may run at the same time (the rest wait in a queue).
MAX_CONCURRENT_DOWNLOADS = max(1, int(os.getenv("MAX_CONCURRENT_DOWNLOADS", "3")))

# yt-dlp needs a JavaScript runtime to solve YouTube's JS challenges, otherwise
# YouTube answers with HTTP 403. Pick whatever is installed (deno is preferred).
def _detect_js_runtimes() -> dict:
    forced = os.getenv("YTDLP_JS_RUNTIME")  # e.g. "node" or "deno:/usr/bin/deno"
    if forced:
        name, _, path = forced.partition(":")
        return {name: ({"path": path} if path else {})}
    for name in ("deno", "node", "bun"):
        path = shutil.which(name)
        if path:
            return {name: {"path": path}}
    return {}


YTDLP_JS_RUNTIMES = _detect_js_runtimes()

# Optional YouTube cookies (Netscape cookies.txt) for when YouTube asks to
# "Sign in to confirm you're not a bot" (common on servers / after many downloads).
# Default location: cookies.txt in the project root (local) or /data/cookies.txt (Docker).
def _detect_cookies_file():
    path = os.getenv("YTDLP_COOKIES_FILE")
    if path:
        return path
    default = os.path.join(os.path.dirname(DB_PATH), "cookies.txt") if IS_DOCKER else os.path.join(_project_root, "cookies.txt")
    return default if os.path.isfile(default) else None


YTDLP_COOKIES_FILE = _detect_cookies_file()

# ── Spotify (optional) ─────────────────────────────────────────────────────────
# Get credentials at https://developer.spotify.com/dashboard
SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID", "")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET", "")

# Public URL of the app. Used for the Spotify OAuth redirect.
# Spotify only accepts http:// for loopback addresses (127.0.0.1), not "localhost";
# anything else must be https:// (e.g. via the ngrok tunnel in docker-compose).
APP_BASE_URL = os.getenv("APP_BASE_URL", "http://127.0.0.1:8000").rstrip("/")
SPOTIFY_REDIRECT_URI = os.getenv("SPOTIFY_REDIRECT_URI") or f"{APP_BASE_URL}/api/spotify/callback"
