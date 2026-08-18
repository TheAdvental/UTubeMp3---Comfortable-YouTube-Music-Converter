import os
import re
import asyncio
import urllib.parse
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import desc
from db.database import get_db, DownloadedSong
from config import DOWNLOADS_DIR
import yt_dlp
from mutagen.id3 import ID3, TIT2, TPE2, ID3NoHeaderError

router = APIRouter()

os.makedirs(DOWNLOADS_DIR, exist_ok=True)

# In-memory dictionary to track progress
download_progress = {}

def py_dlp_hook(d):
    video_id = d.get('info_dict', {}).get('id', 'unknown')
    if d['status'] == 'downloading':
        percent_str = d.get('_percent_str', '0%').strip()
        download_progress[video_id] = {
            "status": "downloading",
            "progress": percent_str
        }
    elif d['status'] == 'finished':
        download_progress[video_id] = {
            "status": "converting",
            "progress": "100%"
        }

def sanitize_filename(name):
    if not name:
        return "Unknown"
    invalid_chars = '<>:"/\\|?*'
    for char in invalid_chars:
        name = name.replace(char, '')
    return name

def tag_mp3(file_path: str, title: str, artist: str):
    """Write Title and Album Artist ID3 tags to an MP3 file."""
    try:
        try:
            tags = ID3(file_path)
        except ID3NoHeaderError:
            tags = ID3()
        tags["TIT2"] = TIT2(encoding=3, text=title)   # Title
        tags["TPE2"] = TPE2(encoding=3, text=artist)   # Album artist
        tags.save(file_path, v2_version=3)
    except Exception as e:
        print(f"[tag_mp3] Could not write tags to {file_path}: {e}")

def start_download(video_id: str, title: str, artist: str, thumbnail: str, db: Session):
    safe_title = sanitize_filename(title)
    safe_artist = sanitize_filename(artist)
    target_filename = f"{safe_artist} - {safe_title}"
    
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': os.path.join(DOWNLOADS_DIR, f'{target_filename}.%(ext)s'),
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'progress_hooks': [py_dlp_hook],
        'quiet': False,
        'no_warnings': True
    }

    try:
        download_progress[video_id] = {"status": "starting", "progress": "0%"}
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            url = f"https://music.youtube.com/watch?v={video_id}"
            info = ydl.extract_info(url, download=True)
            
            expected_filename = ydl.prepare_filename(info)
            base, _ = os.path.splitext(expected_filename)
            final_path = base + ".mp3"
            
            # Use provided title/artist or fallback to info
            # Strip any extension from the fallback title (yt-dlp sometimes includes it)
            raw_title = title if title else info.get('title', '')
            final_title = re.sub(r'\.(mp3|m4a|webm|ogg|flac|wav|opus)$', '', raw_title, flags=re.IGNORECASE).strip()
            final_artist = artist if artist else info.get('uploader', '')
            final_thumbnail = thumbnail if thumbnail else info.get('thumbnail', '')
            
            db_song = DownloadedSong(
                video_id=video_id,
                title=final_title,
                artist=final_artist,
                file_path=final_path,
                thumbnail=final_thumbnail
            )
            
            # Insert or update
            existing = db.query(DownloadedSong).filter(DownloadedSong.video_id == video_id).first()
            if existing:
                existing.file_path = final_path
                existing.title = db_song.title
            else:
                db.add(db_song)
            db.commit()

            # Write ID3 tags (Title + Album Artist) to the MP3 file
            tag_mp3(final_path, final_title, final_artist)

            download_progress[video_id] = {"status": "completed", "progress": "100%"}
            
    except Exception as e:
        download_progress[video_id] = {"status": "error", "error": str(e)}
        print(f"Download error: {e}")

@router.post("/download")
def trigger_download(video_id: str, title: str, artist: str, thumbnail: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    existing = db.query(DownloadedSong).filter(DownloadedSong.video_id == video_id).first()
    if existing:
        return {"message": "Already downloaded", "video_id": video_id}
        
    background_tasks.add_task(start_download, video_id, title, artist, thumbnail, db)
    return {"message": "Download started", "video_id": video_id}

@router.get("/progress/{video_id}")
def get_progress(video_id: str):
    return download_progress.get(video_id, {"status": "unknown"})

@router.get("/history")
def get_download_history(db: Session = Depends(get_db)):
    songs = db.query(DownloadedSong).order_by(desc(DownloadedSong.downloaded_at)).all()
    return songs

@router.get("/file/{video_id}")
def download_file(video_id: str, db: Session = Depends(get_db)):
    """Stream the downloaded MP3 file to the client's browser for saving."""
    song = db.query(DownloadedSong).filter(DownloadedSong.video_id == video_id).first()
    if not song:
        raise HTTPException(status_code=404, detail="Song not found in library")
    if not song.file_path or not os.path.exists(song.file_path):
        raise HTTPException(status_code=404, detail="File not found on disk")
    filename = os.path.basename(song.file_path)
    # Use RFC 5987 encoding so non-ASCII (e.g. Cyrillic) names work in all browsers
    encoded = urllib.parse.quote(filename, safe='')
    content_disposition = f"attachment; filename*=UTF-8''{encoded}"
    return FileResponse(
        path=song.file_path,
        media_type="audio/mpeg",
        headers={"Content-Disposition": content_disposition},
    )

from pydantic import BaseModel
from typing import List

class DeleteSongsRequest(BaseModel):
    video_ids: List[str]

@router.delete("/history")
def delete_history_items(req: DeleteSongsRequest, db: Session = Depends(get_db)):
    deleted = 0
    errors = []
    for vid in req.video_ids:
        song = db.query(DownloadedSong).filter(DownloadedSong.video_id == vid).first()
        if song:
            if song.file_path and os.path.exists(song.file_path):
                try:
                    os.remove(song.file_path)
                except Exception as e:
                    errors.append(f"Failed to delete {song.file_path}: {e}")
            db.delete(song)
            deleted += 1
    db.commit()
    return {"deleted": deleted, "errors": errors}
