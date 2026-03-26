const API_URL = 'http://localhost:8000/api';

const TRANSLATIONS = {
    en: {
        title: "UTubeMp3 - Music Downloader",
        searchTab: "Search",
        historyTab: "My Music",
        artists: "Artists",
        songs: "Tracks",
        albums: "Albums",
        searchPlaceholder: "What are we looking for?...",
        searchBtn: "Search",
        recentSearches: "Recent Searches",
        backToSearch: "← Back to search",
        latestTracks: "Latest Tracks",
        albumsTitle: "Albums",
        artistSearchPlaceholder: "Search track or album...",
        backToArtist: "← Back to artist",
        downloadEntireAlbum: "⬇ Download entire album",
        albumTracks: "Album tracks",
        myMusicTitle: "My Music (Downloaded)",

        nothingFound: "Nothing found",
        unknownArtist: "Unknown",
        albumSuffix: " (Album)",
        artistDescDefault: "No description...",
        noTracksOutsideAlbums: "No tracks outside albums",
        noAlbums: "No albums",
        noTracksInAlbum: "No tracks in album",
        noDownloadedSongs: "No downloaded songs yet",

        downloadToMp3: "To MP3",
        mp3Saved: "MP3 Saved",
        downloadedAtStr: "Downloaded at:",
        fileStr: "File:",

        error: "Error",
        success: "Success",
        warning: "Warning",
        info: "Info",

        searchFailed: "Failed to perform search",
        profileFailed: "Failed to load profile",
        albumProfileFailed: "Failed to load album",
        historyFailed: "Failed to load history",

        downloadAlreadyStarted: "Already downloading",
        alreadyInLibrary: "This track is already in the library",
        downloadStarted: "Download started:",
        downloadFailedStart: "Failed to start download",
        downloadProgressTitle: "Downloading:",
        progressStr: "Progress:",
        downloadSuccessMsg: "successfully downloaded to MP3!",
        downloadErrorMsg: "Error downloading"
    },
    uk: {
        title: "UTubeMp3 - Завантажувач Музики",
        searchTab: "Пошук",
        historyTab: "Моя Музика",
        artists: "Виконавці",
        songs: "Треки",
        albums: "Альбоми",
        searchPlaceholder: "Що шукаємо?...",
        searchBtn: "Знайти",
        recentSearches: "Історія пошуку",
        backToSearch: "← Назад до пошуку",
        latestTracks: "Останні Треки",
        albumsTitle: "Альбоми",
        artistSearchPlaceholder: "Шукати трек чи альбом...",
        backToArtist: "← Назад до виконавця",
        downloadEntireAlbum: "⬇ Завантажити весь альбом",
        albumTracks: "Треки альбому",
        myMusicTitle: "Моя Музика (Завантажене)",

        nothingFound: "Нічого не знайдено",
        unknownArtist: "Невідомо",
        albumSuffix: " (Альбом)",
        artistDescDefault: "Немає опису...",
        noTracksOutsideAlbums: "Немає треків поза альбомами",
        noAlbums: "Немає альбомів",
        noTracksInAlbum: "Немає треків в альбомі",
        noDownloadedSongs: "Ще немає завантажених пісень",

        downloadToMp3: "В MP3",
        mp3Saved: "MP3 Збережено",
        downloadedAtStr: "Завантажено:",
        fileStr: "Файл:",

        error: "Помилка",
        success: "Успіх",
        warning: "Увага",
        info: "Інфо",

        searchFailed: "Не вдалося виконати пошук",
        profileFailed: "Не вдалося завантажити профіль",
        albumProfileFailed: "Не вдалося завантажити альбом",
        historyFailed: "Не вдалося завантажити історію",

        downloadAlreadyStarted: "Вже завантажується",
        alreadyInLibrary: "Цей трек вже є у бібліотеці",
        downloadStarted: "Почалося завантаження:",
        downloadFailedStart: "Не вдалося почати завантаження",
        downloadProgressTitle: "Завантаження:",
        progressStr: "Прогрес:",
        downloadSuccessMsg: "успішно завантажено в MP3!",
        downloadErrorMsg: "Помилка завантаження"
    }
};

let currentLang = localStorage.getItem('lang') || 'en';

function t(key) {
    return TRANSLATIONS[currentLang][key] || key;
}

function updateUIStrings() {
    document.documentElement.lang = currentLang;
    document.title = t('title');

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (TRANSLATIONS[currentLang][key]) {
            el.innerText = TRANSLATIONS[currentLang][key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (TRANSLATIONS[currentLang][key]) {
            el.placeholder = TRANSLATIONS[currentLang][key];
        }
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.getAttribute('data-lang') === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function setLanguage(lang) {
    if (!TRANSLATIONS[lang]) return;
    currentLang = lang;
    localStorage.setItem('lang', lang);
    updateUIStrings();
    
    // We update static UI, dynamic elements like artist/album tracks will re-fetch or could just be re-rendered 
    // by user re-navigating/refreshing, doing simple innerText rewrites works well enough for simple elements
    if (document.getElementById('recent-searches-container').style.display === 'block') {
        renderRecentSearches();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateUIStrings();
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            setLanguage(e.target.getAttribute('data-lang'));
        });
    });
    history.replaceState({ section: 'search' }, '', '#search');
    renderRecentSearches();
});

// DOM Elements
const navSearch = document.getElementById('nav-search');
const navHistory = document.getElementById('nav-history');
const secSearch = document.getElementById('section-search');
const secArtist = document.getElementById('section-artist');
const secAlbum = document.getElementById('section-album');
const secHistory = document.getElementById('section-history');

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const searchResults = document.getElementById('search-results');
const searchLoader = document.getElementById('search-loader');

const backToSearchBtn = document.getElementById('back-to-search');
const backToArtistFromAlbum = document.getElementById('back-to-artist-from-album');
const artistSongs = document.getElementById('artist-songs');
const artistAlbums = document.getElementById('artist-albums');
let currentAlbumTracks = [];
let currentArtistSongsData = [];
let currentArtistAlbumsData = [];
let displayedSongsCount = 10;
let displayedAlbumsCount = 10;
let isPaginatingArtist = false;

// History setup
window.addEventListener('popstate', (e) => {
    if (e.state) {
        if (e.state.section === 'search') switchSection('search', false);
        else if (e.state.section === 'history') { switchSection('history', false); loadHistory(); }
        else if (e.state.section === 'artist') loadArtist(e.state.browseId, false);
        else if (e.state.section === 'album') loadAlbum(e.state.browseId, false);
    } else {
        switchSection('search', false);
    }
});


// Navigation
navSearch.addEventListener('click', () => switchSection('search'));
navHistory.addEventListener('click', () => {
    switchSection('history');
    loadHistory();
});
backToSearchBtn.addEventListener('click', () => history.back());
backToArtistFromAlbum.addEventListener('click', () => history.back());

function switchSection(sec, pushState = true) {
    navSearch.classList.remove('active');
    navHistory.classList.remove('active');
    
    secSearch.style.display = 'none';
    secArtist.style.display = 'none';
    secAlbum.style.display = 'none';
    secHistory.style.display = 'none';
    
    if (sec === 'search') {
        navSearch.classList.add('active');
        secSearch.style.display = 'block';
    } else if (sec === 'artist') {
        secArtist.style.display = 'block';
    } else if (sec === 'album') {
        secAlbum.style.display = 'block';
    } else if (sec === 'history') {
        navHistory.classList.add('active');
        secHistory.style.display = 'block';
    }
    
    if (pushState) {
        window.history.pushState({ section: sec }, '', `#${sec}`);
    }
}

// Recent Searches Logic
function getRecentSearches() {
    return JSON.parse(localStorage.getItem('recentSearches') || '[]');
}

function addRecentSearch(artistObj) {
    let searches = getRecentSearches();
    searches = searches.filter(s => s.browseId !== artistObj.browseId);
    searches.unshift(artistObj);
    if (searches.length > 10) searches.pop();
    localStorage.setItem('recentSearches', JSON.stringify(searches));
    renderRecentSearches();
}

function renderRecentSearches() {
    const list = document.getElementById('recent-searches');
    const container = document.getElementById('recent-searches-container');
    if (!list || !container) return;
    
    const searches = getRecentSearches();
    if (searches.length === 0) {
        container.style.display = 'none';
        return;
    }
    
    container.style.display = 'block';
    list.innerHTML = '';
    searches.forEach(artist => {
        const card = document.createElement('div');
        card.className = 'artist-card';
        card.innerHTML = `
            <img style="width: 80px; height: 80px;" src="${artist.thumb}" alt="${artist.name}">
            <h3 style="font-size: 1rem;">${artist.name}</h3>
        `;
        card.addEventListener('click', () => loadArtist(artist.browseId, true));
        list.appendChild(card);
    });
}

// Search Feature
searchBtn.addEventListener('click', executeSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') executeSearch();
});

async function executeSearch() {
    const query = searchInput.value.trim();
    const type = document.getElementById('search-type').value;
    if (!query) return;

    searchResults.innerHTML = '';
    searchLoader.style.display = 'block';
    
    try {
        const res = await fetch(`${API_URL}/youtube/search?query=${encodeURIComponent(query)}&filter=${type}`);
        const data = await res.json();
        
        searchLoader.style.display = 'none';
        
        if (data.length === 0) {
            searchResults.innerHTML = `<p style="text-align:center; width:100%; grid-column: 1 / -1;">${t('nothingFound')}</p>`;
            return;
        }

        if (type === 'artists') {
            searchResults.className = 'grid-results';
            data.forEach(artist => {
                const thumb = artist.thumbnails && artist.thumbnails.length > 0 ? artist.thumbnails[artist.thumbnails.length-1].url : 'https://via.placeholder.com/120?text=No+Image';
                
                const card = document.createElement('div');
                card.className = 'artist-card';
                card.innerHTML = `
                    <img src="${thumb}" alt="${artist.artist}">
                    <h3>${artist.artist}</h3>
                `;
                card.style.cursor = 'pointer';
                card.addEventListener('click', () => {
                    addRecentSearch({ browseId: artist.browseId, name: artist.artist, thumb: thumb });
                    loadArtist(artist.browseId, true);
                });
                searchResults.appendChild(card);
            });
        } else if (type === 'songs') {
            searchResults.className = 'list-container';
            data.forEach(song => {
                if (!song.videoId) return;
                const thumb = song.thumbnails && song.thumbnails.length ? song.thumbnails[0].url : 'https://via.placeholder.com/50';
                const artistName = song.artists ? song.artists.map(a => a.name).join(', ') : t('unknownArtist');
                const albumName = song.album ? song.album.name : '';
                searchResults.appendChild(createSongItem(song.videoId, song.title, artistName, thumb, albumName));
            });
        } else if (type === 'albums') {
            searchResults.className = 'grid-albums';
            data.forEach(album => {
                if (!album.browseId) return;
                const thumb = album.thumbnails && album.thumbnails.length ? album.thumbnails[0].url : 'https://via.placeholder.com/150';
                const artistName = album.artists ? album.artists.map(a => a.name).join(', ') : t('unknownArtist');
                
                const card = document.createElement('div');
                card.className = 'album-card';
                card.innerHTML = `
                    <img src="${thumb}" alt="${album.title}">
                    <h4 style="margin-top:0.5rem">${album.title}</h4>
                    <p style="font-size:0.8rem; color:#94a3b8;">${artistName} • ${album.year || ''}</p>
                `;
                card.style.cursor = 'pointer';
                card.addEventListener('click', () => {
                    addRecentSearch({ browseId: album.browseId, name: album.title + t('albumSuffix'), thumb: thumb });
                    loadAlbum(album.browseId, true);
                });
                searchResults.appendChild(card);
            });
        }
    } catch (err) {
        searchLoader.style.display = 'none';
        showToast(t('error'), t('searchFailed'), 'error');
    }
}

// Artist Profile Feature
async function loadArtist(browseId, pushState = true) {
    switchSection('artist', false);
    if (pushState) {
        window.history.pushState({ section: 'artist', browseId: browseId }, '', '#artist');
    }
    artistSongs.innerHTML = '<div class="loader"></div>';
    artistAlbums.innerHTML = '<div class="loader"></div>';
    
    const searchInputEl = document.getElementById('artist-search-input');
    if (searchInputEl) searchInputEl.value = ''; // Reset search on load
    
    try {
        const res = await fetch(`${API_URL}/youtube/artist/${browseId}`);
        const data = await res.json();
        
        document.getElementById('artist-name').innerText = data.name;
        document.getElementById('artist-desc').innerText = data.description || t('artistDescDefault');
        
        const thumbUrl = data.thumbnails && data.thumbnails.length > 0 ? data.thumbnails[0].url : 'https://via.placeholder.com/200?text=No+Image';
        document.getElementById('artist-img').src = thumbUrl;
        
        // Set initial capacities
        displayedSongsCount = 10;
        displayedAlbumsCount = 10;
        
        // Cache data for local search
        currentArtistSongsData = data.songs || [];
        currentArtistAlbumsData = data.albums || [];
        
        renderArtistContent(currentArtistSongsData.slice(0, displayedSongsCount), currentArtistAlbumsData.slice(0, displayedAlbumsCount), data.name);
        
        // Background fetch the rest
        if (data.songsBrowseId && currentArtistSongsData.length <= 10) {
            fetch(`${API_URL}/youtube/playlist/${data.songsBrowseId}`).then(r=>r.json()).then(moreSongs => {
                if (Array.isArray(moreSongs)) {
                    const existingIds = new Set(currentArtistSongsData.map(s => s.videoId));
                    const newSongs = moreSongs.filter(s => s.videoId && !existingIds.has(s.videoId));
                    currentArtistSongsData = [...currentArtistSongsData, ...newSongs];
                }
            });
        }
        
        if (data.albumsBrowseId && data.albumsParams) {
             fetch(`${API_URL}/youtube/artist/${data.albumsBrowseId}/albums?params=${data.albumsParams}`).then(r=>r.json()).then(moreAlbums => {
                 if (Array.isArray(moreAlbums)) {
                     const existingIds = new Set(currentArtistAlbumsData.map(a => a.browseId));
                     const newAlbums = moreAlbums.filter(a => a.browseId && !existingIds.has(a.browseId));
                     currentArtistAlbumsData = [...currentArtistAlbumsData, ...newAlbums];
                 }
             });
        }

    } catch (err) {
        showToast(t('error'), t('profileFailed'), 'error');
    }
}

function renderArtistContent(songs, albums, artistName) {
    artistSongs.innerHTML = '';
    if (songs && songs.length) {
        songs.forEach(song => {
            const sThumb = song.thumbnails && song.thumbnails.length ? song.thumbnails[0].url : '';
            artistSongs.appendChild(createSongItem(song.videoId, song.title, artistName, sThumb, song.album?.name));
        });
    } else {
        artistSongs.innerHTML = `<p>${t('noTracksOutsideAlbums')}</p>`;
    }

    artistAlbums.innerHTML = '';
    if (albums && albums.length) {
        albums.forEach(album => {
            const aThumb = album.thumbnails && album.thumbnails.length ? album.thumbnails[0].url : '';
            const card = document.createElement('div');
            card.className = 'album-card';
            card.innerHTML = `
                <img src="${aThumb}" alt="${album.title}">
                <h4>${album.title}</h4>
                <p>${album.year || ''}</p>
            `;
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => loadAlbum(album.browseId, true));
            artistAlbums.appendChild(card);
        });
    } else {
        artistAlbums.innerHTML = `<p>${t('noAlbums')}</p>`;
    }
}

function appendMoreArtistContent() {
    if (isPaginatingArtist) return;
    isPaginatingArtist = true;
    
    const artistName = document.getElementById('artist-name').innerText;
    const nextSongs = currentArtistSongsData.slice(displayedSongsCount, displayedSongsCount + 10);
    const nextAlbums = currentArtistAlbumsData.slice(displayedAlbumsCount, displayedAlbumsCount + 10);
    
    if (nextSongs.length > 0) {
        nextSongs.forEach(song => {
            const sThumb = song.thumbnails && song.thumbnails.length ? song.thumbnails[0].url : '';
            artistSongs.appendChild(createSongItem(song.videoId, song.title, artistName, sThumb, song.album?.name));
        });
        displayedSongsCount += nextSongs.length;
    }
    
    if (nextAlbums.length > 0) {
        nextAlbums.forEach(album => {
            const aThumb = album.thumbnails && album.thumbnails.length ? album.thumbnails[0].url : '';
            const card = document.createElement('div');
            card.className = 'album-card';
            card.innerHTML = `
                <img src="${aThumb}" alt="${album.title}">
                <h4>${album.title}</h4>
                <p>${album.year || ''}</p>
            `;
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => loadAlbum(album.browseId, true));
            artistAlbums.appendChild(card);
        });
        displayedAlbumsCount += nextAlbums.length;
    }
    
    setTimeout(() => { isPaginatingArtist = false; }, 200);
}

document.getElementById('artist-search-input').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const artistName = document.getElementById('artist-name').innerText;
    
    if (query) {
        const filteredSongs = currentArtistSongsData.filter(s => s.title && s.title.toLowerCase().includes(query));
        const filteredAlbums = currentArtistAlbumsData.filter(a => a.title && a.title.toLowerCase().includes(query));
        renderArtistContent(filteredSongs, filteredAlbums, artistName);
    } else {
        renderArtistContent(currentArtistSongsData.slice(0, displayedSongsCount), currentArtistAlbumsData.slice(0, displayedAlbumsCount), artistName);
    }
});

window.addEventListener('scroll', () => {
    if (document.getElementById('section-artist').style.display === 'block') {
        const query = document.getElementById('artist-search-input').value.toLowerCase();
        if (!query) {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
                appendMoreArtistContent();
            }
        }
    }
});

function createSongItem(videoId, title, artist, thumbnail, albumName) {
    const div = document.createElement('div');
    div.className = 'song-item';
    div.innerHTML = `
        <img src="${thumbnail || 'https://via.placeholder.com/50'}" alt="cover">
        <div class="song-info">
            <h4>${title}</h4>
            <p>${albumName || artist}</p>
        </div>
        <button class="download-btn" onclick="startDownload('${videoId}', '${title.replace(/'/g, "\\'")}', '${artist.replace(/'/g, "\\'")}', '${thumbnail}')">${t('downloadToMp3')}</button>
    `;
    return div;
}

// Album Profile Feature
async function loadAlbum(browseId, pushState = true) {
    if (!browseId) return;
    switchSection('album', false);
    if (pushState) {
        window.history.pushState({ section: 'album', browseId: browseId }, '', '#album');
    }
    const tracksContainer = document.getElementById('album-tracks');
    tracksContainer.innerHTML = '<div class="loader"></div>';
    
    try {
        const res = await fetch(`${API_URL}/youtube/album/${browseId}`);
        const data = await res.json();
        
        document.getElementById('album-title').innerText = data.title;
        const artistName = (data.artists && data.artists.length) ? data.artists.map(a => a.name).join(', ') : t('unknownArtist');
        document.getElementById('album-desc').innerText = `${artistName} • ${data.year || ''} • ${data.trackCount || 0} ${t('songs').toLowerCase()}`;
        
        const thumbUrl = data.thumbnails && data.thumbnails.length ? data.thumbnails[0].url : 'https://via.placeholder.com/200';
        document.getElementById('album-img').src = thumbUrl;
        
        currentAlbumTracks = [];
        tracksContainer.innerHTML = '';
        if (data.tracks && data.tracks.length) {
            data.tracks.forEach(track => {
                if (track.videoId) {
                    currentAlbumTracks.push({
                        videoId: track.videoId,
                        title: track.title,
                        artist: artistName,
                        thumbnail: thumbUrl
                    });
                    tracksContainer.appendChild(createSongItem(track.videoId, track.title, artistName, thumbUrl, data.title));
                }
            });
        } else {
            tracksContainer.innerHTML = `<p>${t('noTracksInAlbum')}</p>`;
        }
    } catch (err) {
        showToast(t('error'), t('albumProfileFailed'), 'error');
    }
}

document.getElementById('download-album-btn').addEventListener('click', () => {
    if (currentAlbumTracks && currentAlbumTracks.length > 0) {
        let delay = 0;
        currentAlbumTracks.forEach(track => {
            setTimeout(() => {
                startDownload(track.videoId, track.title, track.artist, track.thumbnail);
            }, delay);
            delay += 1500; // stagger requests by 1.5s to avoid flood
        });
    }
});

// Downloads & Polling
const activeDownloads = new Set();

async function startDownload(videoId, title, artist, thumbnail) {
    if (activeDownloads.has(videoId)) {
        showToast(t('warning'), t('downloadAlreadyStarted'), 'info');
        return;
    }
    
    try {
        const res = await fetch(`${API_URL}/downloader/download?video_id=${videoId}&title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}&thumbnail=${encodeURIComponent(thumbnail)}`, {
            method: 'POST'
        });
        const data = await res.json();
        
        if (data.message === 'Already downloaded') {
            showToast(t('success'), t('alreadyInLibrary'), 'success');
            return;
        }

        showToast(t('info'), `${t('downloadStarted')} ${title}`);
        activeDownloads.add(videoId);
        pollProgress(videoId, title);
        
    } catch (err) {
        showToast(t('error'), t('downloadFailedStart'), 'error');
    }
}

function pollProgress(videoId, title) {
    const toastId = 'toast-' + videoId;
    createPersistentToast(toastId, title, '0%');
    
    const interval = setInterval(async () => {
        try {
            const res = await fetch(`${API_URL}/downloader/progress/${videoId}`);
            const data = await res.json();
            
            updatePersistentToast(toastId, data.progress);
            
            if (data.status === 'completed' || data.status === 'error') {
                clearInterval(interval);
                activeDownloads.delete(videoId);
                
                setTimeout(() => {
                    document.getElementById(toastId)?.remove();
                }, 3000);
                
                if (data.status === 'completed') {
                    showToast(t('success'), `${title} ${t('downloadSuccessMsg')}`, 'success');
                } else {
                    showToast(t('error'), `${t('downloadErrorMsg')} ${title}`, 'error');
                }
            }
        } catch (e) {
            console.error(e);
        }
    }, 1500);
}

// History Feature
async function loadHistory() {
    const historyLoader = document.getElementById('history-loader');
    const historyResults = document.getElementById('history-results');
    
    historyResults.innerHTML = '';
    historyLoader.style.display = 'block';
    
    try {
        const res = await fetch(`${API_URL}/downloader/history`);
        const data = await res.json();
        
        historyLoader.style.display = 'none';
        
        if (data.length === 0) {
            historyResults.innerHTML = `<p style="text-align: center; color: #94a3b8; margin-top:2rem;">${t('noDownloadedSongs')}</p>`;
            return;
        }
        
        data.forEach(song => {
            const div = document.createElement('div');
            div.className = 'song-item';
            
            const dateStr = new Date(song.downloaded_at).toLocaleString((currentLang === 'uk') ? 'uk-UA' : 'en-US');
            
            div.innerHTML = `
                <img src="${song.thumbnail || 'https://via.placeholder.com/50'}" alt="cover">
                <div class="song-info">
                    <h4>${song.title} <span style="font-size: 0.7rem; background: var(--success); padding: 2px 6px; border-radius: 4px; margin-left:10px;">${t('mp3Saved')}</span></h4>
                    <p>${song.artist} • ${t('downloadedAtStr')} ${dateStr}</p>
                    <p style="font-size:0.75rem; color:#64748b; margin-top: 4px;">${t('fileStr')} ${song.file_path}</p>
                </div>
            `;
            historyResults.appendChild(div);
        });
    } catch (err) {
        historyLoader.style.display = 'none';
        showToast(t('error'), t('historyFailed'), 'error');
    }
}

// Toast UI System
function showToast(title, message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-title">${title}</div>
        <div class="toast-body">${message}</div>
    `;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse forwards';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function createPersistentToast(id, title, progressVal) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.id = id;
    toast.innerHTML = `
        <div class="toast-title">${t('downloadProgressTitle')} ${title}</div>
        <div class="toast-body">
            <span>${t('progressStr')}</span>
            <span class="progress-val" style="font-weight:bold; color:var(--primary);">${progressVal}</span>
        </div>
    `;
    container.appendChild(toast);
}

function updatePersistentToast(id, progressVal) {
    const toast = document.getElementById(id);
    if(toast) {
        const valSpan = toast.querySelector('.progress-val');
        if(valSpan) valSpan.innerText = progressVal;
    }
}
