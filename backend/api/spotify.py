from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse, JSONResponse
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials, SpotifyOAuth
from spotipy.exceptions import SpotifyException
from ytmusicapi import YTMusic
import os

try:
    from config import SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET
except ImportError:
    import sys
    sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
    from config import SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET

router = APIRouter()

SPOTIFY_REDIRECT_URI = os.getenv(
    "SPOTIFY_REDIRECT_URI",
    "http://127.0.0.1:8000/api/spotify/callback"  # local dev default
)
SPOTIFY_SCOPE = "playlist-read-private playlist-read-collaborative"

# In-memory token store (persists while server is running)
_user_token: dict = {}


# ── YouTube Music client ────────────────────────────────────────────────────────
yt = YTMusic()


# ── Spotify clients ─────────────────────────────────────────────────────────────
def _check_creds():
    if not SPOTIFY_CLIENT_ID or not SPOTIFY_CLIENT_SECRET:
        raise HTTPException(
            status_code=503,
            detail="Spotify credentials are not configured. "
                   "Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in backend/config.py"
        )

def get_cc_spotify() -> spotipy.Spotify:
    """Client Credentials — for search, albums, artists (no playlist tracks)."""
    _check_creds()
    return spotipy.Spotify(auth_manager=SpotifyClientCredentials(
        client_id=SPOTIFY_CLIENT_ID,
        client_secret=SPOTIFY_CLIENT_SECRET
    ))

def _make_oauth() -> SpotifyOAuth:
    _check_creds()
    return SpotifyOAuth(
        client_id=SPOTIFY_CLIENT_ID,
        client_secret=SPOTIFY_CLIENT_SECRET,
        redirect_uri=SPOTIFY_REDIRECT_URI,
        scope=SPOTIFY_SCOPE,
        cache_path=None,
        open_browser=False,
    )

def get_user_spotify() -> spotipy.Spotify | None:
    """User OAuth client — required for playlist tracks."""
    info = _user_token.get("info")
    if not info:
        return None
    oauth = _make_oauth()
    if oauth.is_token_expired(info):
        try:
            info = oauth.refresh_access_token(info["refresh_token"])
            _user_token["info"] = info
        except Exception:
            _user_token.clear()
            return None
    return spotipy.Spotify(auth=info["access_token"])

def is_logged_in() -> bool:
    return bool(_user_token.get("info"))


# ── Helpers ────────────────────────────────────────────────────────────────────
def _best_image(images: list) -> str:
    if not images:
        return "https://via.placeholder.com/300?text=No+Image"
    return images[0]["url"]


def _format_track(item) -> dict:
    if not item:
        return {}
    artists = [a["name"] for a in (item.get("artists") or [])]
    album = item.get("album") or {}
    images = album.get("images") or item.get("images") or []
    return {
        "id": item.get("id", ""),
        "title": item.get("name", "Unknown"),
        "artists": artists,
        "artistStr": ", ".join(artists) if artists else "Unknown",
        "album": album.get("name", ""),
        "duration_ms": item.get("duration_ms", 0),
        "thumbnail": _best_image(images),
        "previewUrl": item.get("preview_url"),
        "external_url": (item.get("external_urls") or {}).get("spotify", ""),
    }


def _spotify_error(e: Exception) -> HTTPException:
    if isinstance(e, SpotifyException):
        if e.http_status in (401, 403):
            return HTTPException(
                status_code=403,
                detail="NEED_LOGIN: Playlist access requires Spotify login. "
                       "Please click 'Connect Spotify' and log in."
            )
        return HTTPException(status_code=500, detail=f"Spotify error {e.http_status}: {e.msg}")
    return HTTPException(status_code=500, detail=str(e))


# ── OAuth: Login / Callback / Status / Logout ──────────────────────────────────
@router.get("/login")
def spotify_login():
    """Redirect user to Spotify OAuth page."""
    _check_creds()
    auth_url = _make_oauth().get_authorize_url()
    return RedirectResponse(auth_url)

@router.get("/callback")
def spotify_callback(code: str = None, error: str = None):
    """Handle Spotify OAuth callback."""
    if error or not code:
        return RedirectResponse("http://localhost:8000/#spotify?error=access_denied")
    try:
        token_info = _make_oauth().get_access_token(code, as_dict=True)
        _user_token["info"] = token_info
        return RedirectResponse("http://localhost:8000/#spotify")
    except Exception as e:
        return RedirectResponse(f"http://localhost:8000/#spotify?error={str(e)[:100]}")

@router.get("/auth-status")
def auth_status():
    """Check if user is logged in with Spotify."""
    return {"logged_in": is_logged_in()}

@router.post("/logout")
def logout():
    """Clear the stored Spotify user token."""
    _user_token.clear()
    return {"message": "Logged out"}


# ── Search ─────────────────────────────────────────────────────────────────────
@router.get("/search")
def search_spotify(q: str, type: str = "track"):
    """Search the Spotify catalogue. Works with Client Credentials."""
    sp = get_cc_spotify()
    valid_types = {"track", "album", "artist", "playlist"}
    if type not in valid_types:
        type = "track"
    try:
        results = sp.search(q=q, type=type, limit=10)

        if type == "track":
            return [_format_track(t) for t in (results.get("tracks", {}).get("items") or []) if t]

        elif type == "album":
            return [
                {
                    "id": a["id"],
                    "title": a["name"],
                    "artists": [x["name"] for x in a.get("artists", [])],
                    "artistStr": ", ".join(x["name"] for x in a.get("artists", [])),
                    "year": a.get("release_date", "")[:4],
                    "thumbnail": _best_image(a.get("images", [])),
                    "total_tracks": a.get("total_tracks", 0),
                    "external_url": (a.get("external_urls") or {}).get("spotify", ""),
                }
                for a in (results.get("albums", {}).get("items") or []) if a
            ]

        elif type == "artist":
            return [
                {
                    "id": a["id"],
                    "name": a["name"],
                    "genres": a.get("genres", []),
                    "thumbnail": _best_image(a.get("images", [])),
                    "followers": (a.get("followers") or {}).get("total", 0),
                    "external_url": (a.get("external_urls") or {}).get("spotify", ""),
                }
                for a in (results.get("artists", {}).get("items") or []) if a
            ]

        elif type == "playlist":
            return [
                {
                    "id": p["id"],
                    "name": p["name"],
                    "owner": (p.get("owner") or {}).get("display_name", ""),
                    "total_tracks": (p.get("tracks") or {}).get("total", 0),
                    "thumbnail": _best_image(p.get("images", [])),
                    "external_url": (p.get("external_urls") or {}).get("spotify", ""),
                }
                for p in (results.get("playlists", {}).get("items") or []) if p
            ]

        return []
    except HTTPException:
        raise
    except (SpotifyException, Exception) as e:
        raise _spotify_error(e)


# ── Playlist (requires user OAuth) ─────────────────────────────────────────────
@router.get("/playlist/{playlist_id}")
def get_playlist(playlist_id: str):
    """Get metadata + all tracks of a Spotify playlist.
    Requires user to be logged in via /api/spotify/login.
    """
    sp_user = get_user_spotify()
    if not sp_user:
        raise HTTPException(
            status_code=403,
            detail="NEED_LOGIN: Playlist access requires Spotify login. "
                   "Please click 'Connect Spotify' and log in."
        )

    sp_cc = get_cc_spotify()
    try:
        # Get playlist metadata (Client Credentials works for this)
        pl = sp_cc.playlist(playlist_id)

        tracks = []
        # Get playlist tracks using user OAuth (required by Spotify API since 2024)
        page = sp_user.playlist_tracks(playlist_id, limit=50)
        while page:
            for item in (page.get("items") or []):
                track = item.get("track") if item else None
                if track and track.get("id"):
                    tracks.append(_format_track(track))
            if page.get("next"):
                page = sp_user.next(page)
            else:
                break

        return {
            "id": pl["id"],
            "name": pl.get("name", ""),
            "description": pl.get("description", ""),
            "owner": (pl.get("owner") or {}).get("display_name", ""),
            "total_tracks": len(tracks),
            "thumbnail": _best_image(pl.get("images") or []),
            "external_url": (pl.get("external_urls") or {}).get("spotify", ""),
            "tracks": tracks,
        }
    except HTTPException:
        raise
    except (SpotifyException, Exception) as e:
        raise _spotify_error(e)


# ── Album ──────────────────────────────────────────────────────────────────────
@router.get("/album/{album_id}")
def get_album(album_id: str):
    """Get metadata + all tracks of a Spotify album. Works with Client Credentials."""
    sp = get_cc_spotify()
    try:
        al = sp.album(album_id)
        artist_names = [a["name"] for a in al.get("artists", [])]
        thumb = _best_image(al.get("images", []))
        tracks = []
        for t in (al.get("tracks") or {}).get("items", []):
            if not t:
                continue
            t_artists = [a["name"] for a in t.get("artists", [])]
            tracks.append({
                "id": t["id"],
                "title": t["name"],
                "artists": t_artists,
                "artistStr": ", ".join(t_artists),
                "album": al["name"],
                "duration_ms": t.get("duration_ms", 0),
                "thumbnail": thumb,
                "previewUrl": t.get("preview_url"),
            })
        return {
            "id": al["id"],
            "title": al["name"],
            "artists": artist_names,
            "artistStr": ", ".join(artist_names),
            "year": al.get("release_date", "")[:4],
            "total_tracks": al.get("total_tracks", 0),
            "thumbnail": thumb,
            "external_url": (al.get("external_urls") or {}).get("spotify", ""),
            "tracks": tracks,
        }
    except HTTPException:
        raise
    except (SpotifyException, Exception) as e:
        raise _spotify_error(e)


# ── Artist ─────────────────────────────────────────────────────────────────────
@router.get("/artist/{artist_id}")
def get_artist(artist_id: str):
    """Get artist info + their albums. Works with Client Credentials."""
    sp = get_cc_spotify()
    try:
        artist = sp.artist(artist_id)
        # Spotify dev-mode restricts artist_albums limit to max 10 — paginate to get up to 50
        albums_page = sp.artist_albums(artist_id, album_type="album,single", limit=10)
        albums = []
        while albums_page and len(albums) < 50:
            for a in (albums_page.get("items") or []):
                if not a:
                    continue
                albums.append({
                    "id": a["id"],
                    "title": a["name"],
                    "year": a.get("release_date", "")[:4],
                    "total_tracks": a.get("total_tracks", 0),
                    "thumbnail": _best_image(a.get("images", [])),
                    "type": a.get("album_type", "album"),
                })
            if albums_page.get("next") and len(albums) < 50:
                albums_page = sp.next(albums_page)
            else:
                break
        return {
            "id": artist["id"],
            "name": artist["name"],
            "genres": artist.get("genres", []),
            "followers": (artist.get("followers") or {}).get("total", 0),
            "thumbnail": _best_image(artist.get("images", [])),
            "external_url": (artist.get("external_urls") or {}).get("spotify", ""),
            "albums": albums,
        }
    except HTTPException:
        raise
    except (SpotifyException, Exception) as e:
        raise _spotify_error(e)


# ── Resolve Spotify track → YouTube Music video_id ────────────────────────────
@router.get("/resolve")
def resolve_track(title: str, artist: str):
    """Search YouTube Music for a matching video_id."""
    try:
        query = f"{title} {artist}"
        results = yt.search(query, filter="songs", limit=5)
        if not results:
            results = yt.search(query, limit=5)
        if not results:
            raise HTTPException(status_code=404, detail="No matching track found on YouTube Music")
        for r in results:
            vid = r.get("videoId")
            if vid:
                return {"videoId": vid, "title": r.get("title", title), "found": True}
        raise HTTPException(status_code=404, detail="No matching track found on YouTube Music")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
