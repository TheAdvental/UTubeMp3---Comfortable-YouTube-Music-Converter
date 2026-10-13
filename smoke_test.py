"""Smoke test against a running UTubeMp3 instance (local or Docker).

    python smoke_test.py                              # http://127.0.0.1:8000
    python smoke_test.py http://server-ip:8000        # another instance
    python smoke_test.py --download                   # also download one track (and delete it again)

Uses only the standard library, so it runs with any Python 3.10+.
"""
import json
import sys
import time
import urllib.parse
import urllib.request

TEST_VIDEO_ID = "Kx7B-XvmFtE"  # Imagine Dragons - Believer
ARTIST_ID = "UC0aXrjVxG5pZr99v77wZdPQ"  # Imagine Dragons
ALBUM_ID = "MPREb_q16Gzaa1WK8"  # Evolve

args = [a for a in sys.argv[1:] if not a.startswith("--")]
BASE = (args[0] if args else "http://127.0.0.1:8000").rstrip("/") + "/api"
DO_DOWNLOAD = "--download" in sys.argv

failures = 0


def call(path, method="GET", body=None):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(BASE + path, data=data, method=method,
                                 headers={"Content-Type": "application/json"} if data else {})
    with urllib.request.urlopen(req, timeout=60) as res:
        return json.loads(res.read().decode())


def check(name, fn):
    global failures
    try:
        detail = fn()
        print(f"  OK    {name}" + (f"  ({detail})" if detail else ""))
    except Exception as e:
        failures += 1
        print(f"  FAIL  {name}: {e}")


def health():
    h = call("/health")
    assert h["ffmpeg"], "FFmpeg not found"
    assert h["js_runtime"], "no JS runtime (Deno/Node.js) - YouTube downloads will fail with 403"
    return f"env={h['app_env']}, js={h['js_runtime']}, cookies={h.get('cookies')}"


def search(kind):
    def run():
        res = call(f"/youtube/search?query={urllib.parse.quote('Imagine Dragons')}&filter={kind}")
        assert isinstance(res, list) and res, "empty result"
        return f"{len(res)} results"
    return run


def artist():
    a = call(f"/youtube/artist/{ARTIST_ID}")
    assert a["name"] and a["songs"], "no songs"
    return f"{len(a['songs'])} songs, {len(a['albums'])} albums, {len(a['singles'])} singles"


def album():
    a = call(f"/youtube/album/{ALBUM_ID}")
    assert a["tracks"], "no tracks"
    return f"{a['title']}: {len(a['tracks'])} tracks"


def song():
    s = call(f"/youtube/song/{TEST_VIDEO_ID}")
    return s[0]["title"]


def download():
    start = call(f"/downloader/download?video_id={TEST_VIDEO_ID}&title=Believer&artist=Imagine%20Dragons", "POST")
    if start["message"] == "Already downloaded":
        return "already in library (skipped)"
    deadline = time.time() + 180
    while time.time() < deadline:
        p = call(f"/downloader/progress/{TEST_VIDEO_ID}")
        if p["status"] == "completed":
            break
        if p["status"] == "error":
            raise RuntimeError(p.get("error"))
        time.sleep(2)
    else:
        raise TimeoutError("download did not finish in 180s")
    song = next(s for s in call("/downloader/history") if s["video_id"] == TEST_VIDEO_ID)
    assert song["file_exists"], "MP3 missing on disk"
    call("/downloader/history", "DELETE", {"video_ids": [TEST_VIDEO_ID]})
    return f"{song['file_name']} (removed again)"


print(f"Testing {BASE}")
check("health", health)
for kind in ("artists", "songs", "albums"):
    check(f"search {kind}", search(kind))
check("song metadata", song)
check("artist page", artist)
check("album page", album)
check("history", lambda: f"{len(call('/downloader/history'))} songs")
check("spotify status", lambda: "configured" if call("/spotify/auth-status")["configured"] else "not configured (optional)")
if DO_DOWNLOAD:
    check("download + convert + delete", download)

print("All checks passed." if not failures else f"{failures} check(s) failed.")
sys.exit(1 if failures else 0)
