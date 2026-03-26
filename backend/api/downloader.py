import os
import asyncio
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import desc
from db.database import get_db, DownloadedSong
import yt_dlp

router = APIRouter()

# Downloads folder
DOWNLOADS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "downloads")
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

def start_download(video_id: str, title: str, artist: str, thumbnail: str, db: Session):
    safe_title = sanitize_filename(title)
    safe_artist = sanitize_filename(artist)
    target_filename = f"{safe_title} - {safe_artist}"
    
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
            final_title = title if title else info.get('title')
            final_artist = artist if artist else info.get('uploader')
            final_thumbnail = thumbnail if thumbnail else info.get('thumbnail')
            
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
