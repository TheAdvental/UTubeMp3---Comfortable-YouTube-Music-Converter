import json
from ytmusicapi import YTMusic

yt = YTMusic()
try:
    artist = yt.get_artist("UC0aXrjVxG5pZr99v77wZdPQ")
    print("KEYS:", artist.keys())
    
    songs_browse_id = artist.get('songs', {}).get('browseId')
    print("Songs ID:", songs_browse_id)
    if songs_browse_id:
        playlist = yt.get_playlist(songs_browse_id, limit=100)
        print("Playlist tracks length:", len(playlist.get('tracks', [])))
        
    albums_browse_id = artist.get('albums', {}).get('browseId')
    albums_params = artist.get('albums', {}).get('params')
    print("Albums ID:", albums_browse_id, "Params:", albums_params)
    
    if albums_browse_id and albums_params:
        albums = yt.get_artist_albums(albums_browse_id, albums_params)
        print("Albums length:", len(albums))
        
except Exception as e:
    print("Error:", e)
