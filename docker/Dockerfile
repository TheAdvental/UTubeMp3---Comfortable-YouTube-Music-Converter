# Build from the repository root:
#   docker compose -f docker/docker-compose.yml up -d --build
# or
#   docker build -f docker/Dockerfile -t utube-mp3 .

# Deno: JavaScript runtime yt-dlp needs to solve YouTube's JS challenges
# (without it YouTube answers downloads with HTTP 403)
FROM denoland/deno:bin-2.9.7 AS deno

FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# FFmpeg converts the downloaded audio to MP3
RUN apt-get update \
    && apt-get install -y --no-install-recommends ffmpeg \
    && rm -rf /var/lib/apt/lists/*

COPY --from=deno /deno /usr/local/bin/deno

WORKDIR /app

# Dependencies first for better layer caching
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Unprivileged user; /data is the persistent volume (MP3s + SQLite DB)
RUN useradd --create-home --uid 1000 utube \
    && mkdir -p /data/downloads \
    && chown -R utube:utube /data
USER utube

ENV APP_ENV=docker \
    DOWNLOADS_DIR=/data/downloads \
    DB_PATH=/data/downloads.db

VOLUME ["/data"]
EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD python -c "import urllib.request,sys; sys.exit(0 if urllib.request.urlopen('http://127.0.0.1:8000/api/health', timeout=4).status == 200 else 1)"

WORKDIR /app/backend
# Single worker: download progress is kept in memory
CMD ["python", "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1", "--proxy-headers", "--forwarded-allow-ips", "*"]
