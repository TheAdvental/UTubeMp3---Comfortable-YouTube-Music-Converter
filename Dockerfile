# ── Build stage ────────────────────────────────────────────────────────────────
FROM python:3.11-slim

# Install system dependencies
# ffmpeg is required by yt-dlp for audio extraction/conversion to MP3
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install Python dependencies first (layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend and frontend
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Create data directory (will be overridden by volume mount)
RUN mkdir -p /data/downloads

# Set environment variables for data paths
ENV DATA_DIR=/data
ENV DOWNLOADS_DIR=/data/downloads
ENV DB_PATH=/data/downloads.db

# Expose port
EXPOSE 8000

# Run the app
WORKDIR /app/backend
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
