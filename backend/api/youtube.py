from fastapi import APIRouter, HTTPException
from ytmusicapi import YTMusic
from typing import Optional

router = APIRouter()
yt = YTMusic()

@router.get("/search")
def search_items(query: str, filter: str = "artists"):
    """Search for artists, songs, or albums."""
    try:
        results = yt.search(query, filter=filter)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/song/{video_id}")
def get_song_info(video_id: str):
    """Get metadata for a specific song by its video ID."""
    try:
        # fetch song details from Youtube Music
        song_details = yt.get_song(video_id)
        video_details = song_details.get("videoDetails", {})
        
        # Format similar to a list of search results for a song
        thumbnails = video_details.get("thumbnail", {}).get("thumbnails", [])
        thumbnail_url = thumbnails[-1].get("url") if thumbnails else "https://via.placeholder.com/50"
        
        return [{
            "videoId": video_id,
            "title": video_details.get("title", "Unknown Title"),
            "artists": [{"name": video_details.get("author", "Unknown Artist")}],
            "thumbnails": [{"url": thumbnail_url}]
        }]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/artist/{browse_id}")
def get_artist(browse_id: str):
    """Get albums and songs for a specific artist."""
    try:
        artist_details = yt.get_artist(browse_id)
        
        # Songs and albums
        songs = artist_details.get("songs", {}).get("results", [])
        albums = artist_details.get("albums", {}).get("results", [])
        singles = artist_details.get("singles", {}).get("results", [])
        
        return {
            "name": artist_details.get("name"),
            "description": artist_details.get("description"),
            "thumbnails": artist_details.get("thumbnails"),
            "songs": songs,
            "albums": albums,
            "singles": singles,
            "songsBrowseId": artist_details.get("songs", {}).get("browseId"),
            "albumsBrowseId": artist_details.get("albums", {}).get("browseId"),
            "albumsParams": artist_details.get("albums", {}).get("params")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/artist/{browse_id}/albums")
def get_artist_albums_endpoint(browse_id: str, params: str):
    """Get all extended albums for an artist."""
    try:
        return yt.get_artist_albums(browse_id, params)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/playlist/{browse_id}")
def get_playlist_endpoint(browse_id: str):
    """Get all tracks from a playlist."""
    try:
        playlist = yt.get_playlist(browse_id, limit=100)
        return playlist.get('tracks', [])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/album/{browse_id}")
def get_album(browse_id: str):
    """Get tracks for a specific album."""
    try:
        album_details = yt.get_album(browse_id)
        return album_details
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
