import os
import re
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime, timezone
from config import DB_PATH, DOWNLOADS_DIR

os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def _utcnow():
    # Stored as naive UTC (SQLite has no timezone support)
    return datetime.now(timezone.utc).replace(tzinfo=None)


def resolve_file_path(stored_path):
    """Return the actual location of a song's MP3, or None.

    Paths in the DB are absolute, so they break when the project folder is moved
    or a DB is shared between the local and Docker profiles. Fall back to a file
    with the same name in the current DOWNLOADS_DIR.
    """
    if not stored_path:
        return None
    if os.path.exists(stored_path):
        return stored_path
    candidate = os.path.join(DOWNLOADS_DIR, re.split(r"[\\/]",stored_path)[-1])
    return candidate if os.path.exists(candidate) else None


class DownloadedSong(Base):
    __tablename__ = "downloaded_songs"

    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(String, unique=True, index=True)
    title = Column(String, index=True)
    artist = Column(String)
    file_path = Column(String)
    thumbnail = Column(String, nullable=True)
    downloaded_at = Column(DateTime, default=_utcnow)

    @property
    def actual_path(self):
        return resolve_file_path(self.file_path)

    def to_dict(self):
        actual = self.actual_path
        return {
            "id": self.id,
            "video_id": self.video_id,
            "title": self.title,
            "artist": self.artist,
            "file_path": actual or self.file_path,
            "file_name": re.split(r"[\\/]",self.file_path)[-1] if self.file_path else None,
            "file_exists": actual is not None,
            "thumbnail": self.thumbnail,
            # Explicit "Z" so the browser converts UTC to local time correctly
            "downloaded_at": self.downloaded_at.isoformat() + "Z" if self.downloaded_at else None,
        }


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
