import os
import re
import shutil
import threading
import urllib.parse
from typing import List, Optional

import yt_dlp
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from mutagen.id3 import ID3, TIT2, TPE1, TPE2, ID3NoHeaderError
from pydantic import BaseModel
from sqlalchemy import desc
from sqlalchemy.orm import Session

from config import (
    DOWNLOADS_DIR,
    MAX_CONCURRENT_DOWNLOADS,
    YTDLP_COOKIES_FILE,
    YTDLP_JS_RUNTIMES,
)
from db.database import get_db, SessionLocal, DownloadedSong

router = APIRouter()

os.makedirs(DOWNLOADS_DIR, exist_ok=True)

# In-memory progress tracking, keyed by video_id. Single-worker only.
download_progress = {}
_progress_lock = threading.Lock()
_download_slots = threading.Semaphore(MAX_CONCURRENT_DOWNLOADS)

ACTIVE_STATUSES = ("queued", "starting", "downloading", "converting")

_project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def _ffmpeg_location() -> Optional[str]:
    """FFmpeg from PATH, or ffmpeg.exe dropped into the project root."""
    if shutil.which("ffmpeg"):
        return None  # yt-dlp finds it itself
    for name in ("ffmpeg.exe", "ffmpeg"):
        candidate = os.path.join(_project_root, name)
        if os.path.isfile(candidate):
            return candidate
    return None


def ffmpeg_available() -> bool:
    return bool(shutil.which("ffmpeg") or _ffmpeg_location())


def _set_progress(video_id: str, **data):
    with _progress_lock:
        download_progress[video_id] = data


def _progress_hook(d):
    video_id = (d.get("info_dict") or {}).get("id", "unknown")
    if d["status"] == "downloading":
        # Compute percent from byte counts: _percent_str may contain ANSI color codes
        total = d.get("total_bytes") or d.get("total_bytes_estimate") or 0
        done = d.get("downloaded_bytes") or 0
        percent = (done / total * 100) if total else 0
        _set_progress(video_id, status="downloading", progress=f"{percent:.1f}%")
    elif d["status"] == "finished":
        _set_progress(video_id, status="converting", progress="100%")


def sanitize_filename(name):
    if not name:
        return "Unknown"
    name = re.sub(r'[<>:"/\\|?*\x00-\x1f]', "", name)
    # Windows doesn't allow trailing dots/spaces; also keep names reasonably short
    name = name.strip().rstrip(". ")[:150]
    return name or "Unknown"


def tag_mp3(file_path: str, title: str, artist: str):
    """Write Title, Artist and Album Artist ID3 tags to an MP3 file."""
    try:
        try:
            tags = ID3(file_path)
        except ID3NoHeaderError:
            tags = ID3()
        tags["TIT2"] = TIT2(encoding=3, text=title)   # Title
        tags["TPE1"] = TPE1(encoding=3, text=artist)  # Artist
        tags["TPE2"] = TPE2(encoding=3, text=artist)  # Album artist
        tags.save(file_path, v2_version=3)
    except Exception as e:
        print(f"[tag_mp3] Could not write tags to {file_path}: {e}")


def _build_target_name(video_id: str, title: str, artist: str) -> str:
    base = f"{sanitize_filename(artist)} - {sanitize_filename(title)}"
    # Don't overwrite a different track that happens to have the same name
    if os.path.exists(os.path.join(DOWNLOADS_DIR, base + ".mp3")):
        base = f"{base} [{video_id}]"
    return base


def start_download(video_id: str, title: str, artist: str, thumbnail: str):
    _set_progress(video_id, status="queued", progress="0%")

    with _download_slots:
        _set_progress(video_id, status="starting", progress="0%")
        # The request-scoped session is already closed when a background task runs,
        # so the task opens its own.
        db = SessionLocal()
        try:
            _run_download(db, video_id, title, artist, thumbnail)
            _set_progress(video_id, status="completed", progress="100%")
        except Exception as e:
            message = str(e)
            if "403" in message and not YTDLP_JS_RUNTIMES:
                message += " (no JavaScript runtime found: install Deno or Node.js, see README)"
            elif "not a bot" in message or "429" in message:
                message = ("YouTube temporarily blocked requests from this IP (bot check / rate limit). "
                           "Wait a while, or provide YouTube cookies - see README, section 'YouTube cookies'.")
            _set_progress(video_id, status="error", progress="0%", error=message)
            print(f"[download] {video_id} failed: {message}")
        finally:
            db.close()


def _run_download(db: Session, video_id: str, title: str, artist: str, thumbnail: str):
    target_name = _build_target_name(video_id, title or video_id, artist)

    ydl_opts = {
        "format": "bestaudio/best",
        "outtmpl": os.path.join(DOWNLOADS_DIR, f"{target_name}.%(ext)s"),
        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "192",
        }],
        "progress_hooks": [_progress_hook],
        "noplaylist": True,
        "quiet": True,
        "no_warnings": True,
        "noprogress": True,
    }
    if YTDLP_JS_RUNTIMES:
        ydl_opts["js_runtimes"] = YTDLP_JS_RUNTIMES
    if YTDLP_COOKIES_FILE:
        ydl_opts["cookiefile"] = YTDLP_COOKIES_FILE
    ffmpeg_location = _ffmpeg_location()
    if ffmpeg_location:
        ydl_opts["ffmpeg_location"] = ffmpeg_location

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(f"https://music.youtube.com/watch?v={video_id}", download=True)

        downloads = info.get("requested_downloads") or []
        final_path = downloads[0].get("filepath") if downloads else None
        if not final_path or not final_path.lower().endswith(".mp3"):
            final_path = os.path.splitext(ydl.prepare_filename(info))[0] + ".mp3"

    if not os.path.exists(final_path):
        raise RuntimeError(f"Conversion finished but {final_path} was not created (is FFmpeg installed?)")

    # Use provided title/artist or fall back to what yt-dlp found.
    # Strip any extension from the fallback title (yt-dlp sometimes includes it)
    raw_title = title or info.get("track") or info.get("title", "")
    final_title = re.sub(r"\.(mp3|m4a|webm|ogg|flac|wav|opus)$", "", raw_title, flags=re.IGNORECASE).strip()
    final_artist = artist or info.get("artist") or info.get("uploader", "")
    final_thumbnail = thumbnail or info.get("thumbnail", "")

    existing = db.query(DownloadedSong).filter(DownloadedSong.video_id == video_id).first()
    if existing:
        existing.file_path = final_path
        existing.title = final_title
        existing.artist = final_artist
        existing.thumbnail = final_thumbnail
    else:
        db.add(DownloadedSong(
            video_id=video_id,
            title=final_title,
            artist=final_artist,
            file_path=final_path,
            thumbnail=final_thumbnail,
        ))
    db.commit()

    tag_mp3(final_path, final_title, final_artist)


@router.post("/download")
def trigger_download(
    video_id: str,
    background_tasks: BackgroundTasks,
    title: str = "",
    artist: str = "",
    thumbnail: str = "",
    db: Session = Depends(get_db),
):
    if not re.fullmatch(r"[A-Za-z0-9_-]{11}", video_id):
        raise HTTPException(status_code=400, detail="Invalid video_id")

    existing = db.query(DownloadedSong).filter(DownloadedSong.video_id == video_id).first()
    if existing and existing.actual_path:
        return {"message": "Already downloaded", "video_id": video_id}

    with _progress_lock:
        current = download_progress.get(video_id, {})
        if current.get("status") in ACTIVE_STATUSES:
            return {"message": "Already downloading", "video_id": video_id}
        # Reserve the slot immediately so double clicks don't start two jobs
        download_progress[video_id] = {"status": "queued", "progress": "0%"}

    background_tasks.add_task(start_download, video_id, title, artist, thumbnail)
    return {"message": "Download started", "video_id": video_id}


@router.get("/progress/{video_id}")
def get_progress(video_id: str):
    return download_progress.get(video_id, {"status": "unknown"})


@router.get("/history")
def get_download_history(db: Session = Depends(get_db)):
    songs = db.query(DownloadedSong).order_by(desc(DownloadedSong.downloaded_at)).all()
    return [song.to_dict() for song in songs]


@router.get("/file/{video_id}")
def download_file(video_id: str, db: Session = Depends(get_db)):
    """Stream the downloaded MP3 file to the client's browser for saving."""
    song = db.query(DownloadedSong).filter(DownloadedSong.video_id == video_id).first()
    if not song:
        raise HTTPException(status_code=404, detail="Song not found in library")
    path = song.actual_path
    if not path:
        raise HTTPException(status_code=404, detail="File not found on disk")
    filename = os.path.basename(path)
    # Use RFC 5987 encoding so non-ASCII (e.g. Cyrillic) names work in all browsers
    encoded = urllib.parse.quote(filename, safe="")
    content_disposition = f"attachment; filename*=UTF-8''{encoded}"
    return FileResponse(
        path=path,
        media_type="audio/mpeg",
        headers={"Content-Disposition": content_disposition},
    )


class DeleteSongsRequest(BaseModel):
    video_ids: List[str]


@router.delete("/history")
def delete_history_items(req: DeleteSongsRequest, db: Session = Depends(get_db)):
    deleted = 0
    errors = []
    for vid in req.video_ids:
        song = db.query(DownloadedSong).filter(DownloadedSong.video_id == vid).first()
        if song:
            path = song.actual_path
            if path:
                try:
                    os.remove(path)
                except Exception as e:
                    errors.append(f"Failed to delete {path}: {e}")
                    continue  # keep the DB record so the file isn't orphaned
            db.delete(song)
            deleted += 1
            download_progress.pop(vid, None)
    db.commit()
    return {"deleted": deleted, "errors": errors}
