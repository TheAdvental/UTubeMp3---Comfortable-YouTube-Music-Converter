import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from api.youtube import router as youtube_router
from api.downloader import router as downloader_router
from db.database import Base, engine

# Ensure database tables exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="YouTube Music Downloader API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(youtube_router, prefix="/api/youtube", tags=["youtube"])
app.include_router(downloader_router, prefix="/api/downloader", tags=["downloader"])

# Mount frontend files at root
frontend_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
os.makedirs(frontend_dir, exist_ok=True)
app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")
