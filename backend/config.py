import os

# ── Spotify API credentials ────────────────────────────────────────────────────
# Set via environment variables (recommended for production/Docker)
# or keep hardcoded values below for local development.
SPOTIFY_CLIENT_ID = os.getenv(
    "SPOTIFY_CLIENT_ID",
    "a3bc92fad31d4b4ba9cb838c1ff9514a"   # local dev fallback
)
SPOTIFY_CLIENT_SECRET = os.getenv(
    "SPOTIFY_CLIENT_SECRET",
    "699a702ac0384a8393cd0a00b178d273"   # local dev fallback
)

# ── Data paths ─────────────────────────────────────────────────────────────────
# In Docker these point to the mounted /data volume.
# Locally they fall back to the project root.
_project_root = os.path.dirname(os.path.dirname(__file__))

DATA_DIR = os.getenv("DATA_DIR", _project_root)
DOWNLOADS_DIR = os.getenv("DOWNLOADS_DIR", os.path.join(_project_root, "downloads"))
DB_PATH = os.getenv("DB_PATH", os.path.join(_project_root, "downloads.db"))
