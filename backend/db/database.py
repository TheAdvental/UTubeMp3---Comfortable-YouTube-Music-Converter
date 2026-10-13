import os
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime

# DB_PATH: read from environment (set in Docker), fallback to project root for local dev
_default_db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "downloads.db")
DB_PATH = os.environ.get("DB_PATH", _default_db_path)
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class DownloadedSong(Base):
    __tablename__ = "downloaded_songs"

    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(String, unique=True, index=True)
    title = Column(String, index=True)
    artist = Column(String)
    file_path = Column(String)
    thumbnail = Column(String, nullable=True)
    downloaded_at = Column(DateTime, default=datetime.utcnow)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
