import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import config
from api.youtube import router as youtube_router
from api.downloader import router as downloader_router, ffmpeg_available
from api.spotify import router as spotify_router
from db.database import Base, engine

# Ensure database tables exist
Base.metadata.create_all(bind=engine)


def _report_environment():
    print(f"[UTubeMp3] Profile: {config.APP_ENV}")
    print(f"[UTubeMp3] Downloads: {config.DOWNLOADS_DIR}")
    print(f"[UTubeMp3] Database:  {config.DB_PATH}")
    if not ffmpeg_available():
        print("[UTubeMp3] WARNING: FFmpeg not found - MP3 conversion will fail. Install it: winget install Gyan.FFmpeg")
    if not config.YTDLP_JS_RUNTIMES:
        print("[UTubeMp3] WARNING: No JavaScript runtime (Deno/Node.js) found - YouTube will answer 403. "
              "Install one: winget install DenoLand.Deno")
    else:
        print(f"[UTubeMp3] JS runtime for yt-dlp: {next(iter(config.YTDLP_JS_RUNTIMES))}")
    if config.YTDLP_COOKIES_FILE:
        print(f"[UTubeMp3] Using YouTube cookies from {config.YTDLP_COOKIES_FILE}")


@asynccontextmanager
async def lifespan(_app):
    _report_environment()
    yield


app = FastAPI(title="YouTube Music Downloader API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(youtube_router, prefix="/api/youtube", tags=["youtube"])
app.include_router(downloader_router, prefix="/api/downloader", tags=["downloader"])
app.include_router(spotify_router, prefix="/api/spotify", tags=["spotify"])


@app.get("/api/health", tags=["meta"])
def health():
    """Liveness + environment diagnostics."""
    js_runtime = next(iter(config.YTDLP_JS_RUNTIMES), None)
    return {
        "status": "ok",
        "app_env": config.APP_ENV,
        "ffmpeg": ffmpeg_available(),
        "js_runtime": js_runtime,
        "cookies": bool(config.YTDLP_COOKIES_FILE),
    }


@app.get("/api/config", tags=["meta"])
def client_config():
    """Settings the frontend needs to adapt to the deployment profile."""
    return {
        "app_env": config.APP_ENV,
        "auto_browser_download": config.AUTO_BROWSER_DOWNLOAD,
        "show_file_paths": not config.IS_DOCKER,
    }


# Mount frontend files at root
frontend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend")
app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")
