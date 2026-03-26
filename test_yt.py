from ytmusicapi import YTMusic
import json

yt = YTMusic()
artist = yt.get_artist("UC0aXrjVxG5pZr99v77wZdPQ") # Imagine Dragons

print("Artist keys:", artist.keys())

if 'albums' in artist and 'browseId' in artist['albums']:
    try:
        albumsId = artist['albums']['browseId']
        params = artist['albums'].get('params')
        print("Album ID:", albumsId, "Params:", params)
        all_albums = yt.get_artist_albums(albumsId, params)
        print("Found", len(all_albums), "albums.")
    except Exception as e:
        print("Error getting albums:", e)

if 'songs' in artist and 'browseId' in artist['songs']:
    try:
        songsId = artist['songs']['browseId']
        print("Songs Playlist ID:", songsId)
        playlist = yt.get_playlist(songsId)
        print("Found", len(playlist.get('tracks', [])), "songs.")
    except Exception as e:
        print("Error getting songs:", e)
