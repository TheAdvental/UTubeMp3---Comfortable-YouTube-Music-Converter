FROM python:3.12-slim

# Install system dependencies including ffmpeg
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Create directories for persistent data
RUN mkdir -p /data/downloads

# Environment variables (can be overridden in docker-compose)
ENV APP_ENV=docker
ENV DOWNLOADS_DIR=/data/downloads
ENV DB_PATH=/data/downloads.db

EXPOSE 8000

# Run from backend directory so relative imports work correctly
WORKDIR /app/backend
CMD ["python", "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
