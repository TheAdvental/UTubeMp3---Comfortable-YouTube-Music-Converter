const API_URL = window.location.origin + '/api';

const TRANSLATIONS = {
    en: {
        title: "UTubeMp3 - Music Downloader",
        searchTab: "Search",
        historyTab: "My Music",
        artists: "Artists",
        songs: "Tracks",
        albums: "Albums",
        byUrl: "By URL",
        searchByUrlTitle: "Fast Search by URL",
        searchByInfoTitle: "Search by Track Information",
        searchPlaceholder: "What are we looking for?...",
        searchPlaceholderUrl: "Paste YouTube link here...",
        invalidUrlError: "Please enter a valid YouTube or YouTube Music link.",
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
        downloadErrorMsg: "Error downloading",
        queueCountSingle: "1 track downloading",
        queueCountMultiple: "{count} tracks downloading",
        queueCompleted: "All downloads completed",
        selectedCount: "{count} selected",
        downloadSelected: "⬇ Download",
        deleteSelected: "🗑 Delete",
        cancelSelection: "✕ Cancel",
        confirmDelete: "Are you sure you want to delete the selected tracks and files? This cannot be undone.",
        deleteSuccess: "Successfully deleted selected items.",
        deleteFailed: "Failed to delete.",
        multiSelectMode: "Select Multiple",
        saveToDevice: "💾 Save to device",
        // Spotify
        spotifyTab: "Spotify",
        spotifyUrlTitle: "Open Spotify Playlist / Album",
        spotifyUrlPlaceholder: "Paste Spotify playlist or album link...",
        spotifySearchTitle: "Search Spotify Catalog",
        spotifySearchPlaceholder: "Search Spotify...",
        openBtn: "Open",
        playlists: "Playlists",
        tracks: "Tracks",
        fromSpotify: "FROM SPOTIFY",
        backToSpotify: "← Back to Spotify",
        downloadEntirePlaylist: "⬇ Download all tracks",
        playlistTracks: "Playlist tracks",
        albumTracks: "Album tracks",
        spotifyCredsTitle: "Spotify API not configured",
        spotifyCredsDesc: "Add your Client ID and Secret in backend/config.py to enable Spotify features.",
        resolving: "Finding...",
        spotifySearchFailed: "Failed to search Spotify",
        spotifyLoadFailed: "Failed to load from Spotify",
        spotifyResolveFailed: "Could not find this track on YouTube",
        playlistPrivateError: "This playlist is private. Please right-click it in Spotify → Make public, then try again.",
        noAlbums: "No albums found.",
    },
    uk: {
        title: "UTubeMp3 - Завантажувач Музики",
        searchTab: "Пошук",
        historyTab: "Моя Музика",
        artists: "Артисти",
        songs: "Треки",
        albums: "Альбоми",
        byUrl: "За посиланням",
        searchByUrlTitle: "Швидкий пошук за посиланням",
        searchByInfoTitle: "Пошук за інформацією",
        searchPlaceholder: "Що будемо шукати?...",
        searchPlaceholderUrl: "Вставте посилання на YouTube...",
        invalidUrlError: "Будь ласка, введіть дійсне посилання на YouTube або YouTube Music.",
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
        downloadErrorMsg: "Помилка завантаження",
        queueCountSingle: "1 трек завантажується",
        queueCountMultiple: "{count} треків завантажується",
        queueCompleted: "Всі завантаження завершено",
        selectedCount: "Обрано: {count}",
        downloadSelected: "⬇ Завантажити",
        deleteSelected: "🗑 Видалити",
        cancelSelection: "✕ Скасувати",
        confirmDelete: "Ви впевнені, що хочете видалити обрані файли з комп'ютера і історії? Цю дію не можна скасувати.",
        deleteSuccess: "Успішно видалено.",
        deleteFailed: "Не вдалося видалити.",
        multiSelectMode: "Вибрати декілька",
        saveToDevice: "💾 Зберегти на пристрій",
        // Spotify
        spotifyTab: "Spotify",
        spotifyUrlTitle: "Відкрити плейлист / альбом Spotify",
        spotifyUrlPlaceholder: "Вставте посилання на плейліст або альбом Spotify...",
        spotifySearchTitle: "Пошук по каталогу Spotify",
        spotifySearchPlaceholder: "Пошук в Spotify...",
        openBtn: "Відкрити",
        playlists: "Плейлисти",
        tracks: "Треки",
        fromSpotify: "З SPOTIFY",
        backToSpotify: "← Назад до Spotify",
        downloadEntirePlaylist: "⬇ Завантажити всі треки",
        playlistTracks: "Треки плейлиста",
        albumTracks: "Треки альбому",
        spotifyCredsTitle: "Spotify API не налаштовано",
        spotifyCredsDesc: "Додайте Client ID та Secret у backend/config.py щоб увімкнути Spotify.",
        resolving: "Пошук...",
        spotifySearchFailed: "Не вдалося виконати пошук у Spotify",
        spotifyLoadFailed: "Не вдалося завантажити дані зі Spotify",
        spotifyResolveFailed: "Не вдалося знайти трек на YouTube",
        playlistPrivateError: "Плейліст приватний. Натисніть ПКМ на нього в Spotify → 'Зробити публічним', і спробуйте знову.",
        noAlbums: "Альбоми не знайдені.",
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

    const queueHeader = document.getElementById('queue-header');
    if (queueHeader) {
        queueHeader.addEventListener('click', () => {
            const qContainer = document.getElementById('queue-container');
            const qList = document.getElementById('queue-list');
            qContainer.classList.toggle('expanded');
            if (qContainer.classList.contains('expanded')) {
                qList.style.display = 'block';
            } else {
                qList.style.display = 'none';
            }
        });
    }
    
    const albumMultiSelectBtn = document.getElementById('multi-select-album-btn');
    const historyMultiSelectBtn = document.getElementById('multi-select-history-btn');

    albumMultiSelectBtn?.addEventListener('click', () => {
        const list = document.getElementById('album-tracks');
        list.classList.toggle('selection-mode');
        
        if (list.classList.contains('selection-mode')) {
            albumMultiSelectBtn.classList.add('active');
            injectCheckboxes('album-tracks', 'download');
        } else {
            albumMultiSelectBtn.classList.remove('active');
            uncheckAll();
            removeCheckboxes('album-tracks');
        }
    });

    historyMultiSelectBtn?.addEventListener('click', () => {
        const list = document.getElementById('history-results');
        list.classList.toggle('selection-mode');
        
        if (list.classList.contains('selection-mode')) {
            historyMultiSelectBtn.classList.add('active');
            injectCheckboxes('history-results', 'delete');
        } else {
            historyMultiSelectBtn.classList.remove('active');
            uncheckAll();
            removeCheckboxes('history-results');
        }
    });

});

// DOM Elements
const navSearch = document.getElementById('nav-search');
const navHistory = document.getElementById('nav-history');
const navSpotify = document.getElementById('nav-spotify');
const secSearch = document.getElementById('section-search');
const secArtist = document.getElementById('section-artist');
const secAlbum = document.getElementById('section-album');
const secHistory = document.getElementById('section-history');
const secSpotify = document.getElementById('section-spotify');
const secSpotifyPlaylist = document.getElementById('section-spotify-playlist');
const secSpotifyArtist = document.getElementById('section-spotify-artist');

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
        else if (e.state.section === 'spotify') switchSection('spotify', false);
        else if (e.state.section === 'spotify-playlist') loadSpotifyPlaylist(e.state.spotifyId, e.state.spotifyType, false);
        else if (e.state.section === 'spotify-artist') loadSpotifyArtist(e.state.spotifyId, false);
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
navSpotify.addEventListener('click', () => switchSection('spotify'));

document.querySelector('.logo')?.addEventListener('click', () => {
    navSearch.click();
    // Clear search input if desired, or just return to the main search view
    const searchInput = document.getElementById('search-input');
    if (searchInput && searchInput.value === '') {
        // Already empty
    }
});

backToSearchBtn.addEventListener('click', () => history.back());
backToArtistFromAlbum.addEventListener('click', () => history.back());

function switchSection(sec, pushState = true) {
    uncheckAll(); // Clean selection state on tab switch
    
    document.getElementById('album-tracks')?.classList.remove('selection-mode');
    removeCheckboxes('album-tracks');
    document.getElementById('multi-select-album-btn')?.classList.remove('active');
    
    document.getElementById('history-results')?.classList.remove('selection-mode');
    removeCheckboxes('history-results');
    document.getElementById('multi-select-history-btn')?.classList.remove('active');

    document.getElementById('spotify-pl-tracks')?.classList.remove('selection-mode');
    removeCheckboxes('spotify-pl-tracks');
    document.getElementById('multi-select-spotify-btn')?.classList.remove('active');

    navSearch.classList.remove('active');
    navHistory.classList.remove('active');
    navSpotify.classList.remove('active');
    
    secSearch.style.display = 'none';
    secArtist.style.display = 'none';
    secAlbum.style.display = 'none';
    secHistory.style.display = 'none';
    secSpotify.style.display = 'none';
    secSpotifyPlaylist.style.display = 'none';
    secSpotifyArtist.style.display = 'none';
    
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
    } else if (sec === 'spotify') {
        navSpotify.classList.add('active');
        secSpotify.style.display = 'block';
    } else if (sec === 'spotify-playlist') {
        navSpotify.classList.add('active');
        secSpotifyPlaylist.style.display = 'block';
    } else if (sec === 'spotify-artist') {
        navSpotify.classList.add('active');
        secSpotifyArtist.style.display = 'block';
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
const urlSearchInput = document.getElementById('url-search-input');
const urlSearchBtn = document.getElementById('url-search-btn');

urlSearchBtn.addEventListener('click', () => executeSearch('url'));
urlSearchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') executeSearch('url');
});

searchBtn.addEventListener('click', () => executeSearch('info'));
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') executeSearch('info');
});

async function executeSearch(source) {
    let query, type;
    
    if (source === 'url') {
        query = urlSearchInput.value.trim();
        type = 'url';
    } else {
        query = searchInput.value.trim();
        type = document.getElementById('search-type').value;
    }
    
    if (!query) return;

    searchResults.innerHTML = '';
    searchLoader.style.display = 'block';
    
    // Check if query is a YouTube URL
    const ytUrlRegex = /(?:https?:\/\/)?(?:www\.|music\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = query.match(ytUrlRegex);
    
    try {
        let res, data;
        let renderType = type;
        
        if (type === 'url' || (match && match[1])) {
            if (!match || !match[1]) {
                searchLoader.style.display = 'none';
                showToast(t('error'), t('invalidUrlError'), 'error');
                return;
            }
            const videoId = match[1];
            res = await fetch(`${API_URL}/youtube/song/${videoId}`);
            data = await res.json();
            renderType = 'songs'; // Force render as songs list
        } else {
            res = await fetch(`${API_URL}/youtube/search?query=${encodeURIComponent(query)}&filter=${type}`);
            data = await res.json();
        }
        
        searchLoader.style.display = 'none';
        
        if (!data || data.detail || data.error || data.length === 0) {
            searchResults.innerHTML = `<p style="text-align:center; width:100%; grid-column: 1 / -1;">${t('nothingFound')}</p>`;
            return;
        }

        if (renderType === 'artists') {
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
        } else if (renderType === 'songs') {
            searchResults.className = 'list-container';
            data.forEach(song => {
                if (!song.videoId) return;
                const thumb = song.thumbnails && song.thumbnails.length ? song.thumbnails[0].url : 'https://via.placeholder.com/50';
                const artistName = song.artists ? song.artists.map(a => a.name).join(', ') : t('unknownArtist');
                const albumName = song.album ? song.album.name : '';
                searchResults.appendChild(createSongItem(song.videoId, song.title, artistName, thumb, albumName));
            });
        } else if (renderType === 'albums') {
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
    
    // Prepare data strings safely for HTML attributes
    const safeTitle = (title || "").replace(/"/g, '&quot;');
    const safeArtist = (artist || "").replace(/"/g, '&quot;');
    const safeThumb = (thumbnail || "").replace(/"/g, '&quot;');
    
    div.setAttribute('data-video-id', videoId);
    div.setAttribute('data-title', safeTitle);
    div.setAttribute('data-artist', safeArtist);
    div.setAttribute('data-thumbnail', safeThumb);

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
const downloadQueue = new Map();

function updateQueueUI() {
    const qContainer = document.getElementById('queue-container');
    const qCount = document.getElementById('queue-count');
    const qProgressFill = document.getElementById('queue-progress-fill');
    const qList = document.getElementById('queue-list');
    
    if (downloadQueue.size === 0) {
        qContainer.classList.remove('active');
        return;
    }
    
    qContainer.classList.add('active');
    
    let activeCount = 0;
    let totalProgress = 0;
    
    qList.innerHTML = '';
    
    downloadQueue.forEach((item, videoId) => {
        if (item.status === 'downloading') {
            activeCount++;
            let pVal = parseFloat(item.progress) || 0;
            totalProgress += pVal;
        }
        
        const qItem = document.createElement('div');
        qItem.className = 'queue-item';
        qItem.innerHTML = `
            <div class="queue-item-header">
                <span class="queue-item-title" title="${item.title}">${item.title}</span>
                <span class="queue-item-status">${item.status === 'completed' ? t('success') : item.status === 'error' ? t('error') : item.progress}</span>
            </div>
            <div class="queue-item-progress-bar">
                <div class="queue-item-progress-fill" style="width: ${item.status === 'completed' ? '100%' : item.status === 'error' ? '0%' : item.progress}; background: ${item.status === 'completed' ? 'var(--success)' : item.status === 'error' ? '#ef4444' : 'var(--primary)'}"></div>
            </div>
        `;
        qList.appendChild(qItem);
    });
    
    if (activeCount > 0) {
        qCount.innerText = activeCount === 1 ? t('queueCountSingle') : t('queueCountMultiple').replace('{count}', activeCount);
        qProgressFill.style.width = (totalProgress / activeCount) + '%';
    } else {
        qCount.innerText = t('queueCompleted');
        qProgressFill.style.width = '100%';
        
        setTimeout(() => {
            let allDone = true;
            downloadQueue.forEach(i => { if(i.status === 'downloading') allDone = false; });
            if (allDone) {
                downloadQueue.clear();
                updateQueueUI();
            }
        }, 5000);
    }
}

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
        downloadQueue.set(videoId, { title: title, progress: '0%', status: 'downloading' });
        updateQueueUI();
        pollProgress(videoId, title);
        
    } catch (err) {
        showToast(t('error'), t('downloadFailedStart'), 'error');
    }
}

function pollProgress(videoId, title) {
    const interval = setInterval(async () => {
        try {
            const res = await fetch(`${API_URL}/downloader/progress/${videoId}`);
            const data = await res.json();
            
            const qItem = downloadQueue.get(videoId);
            if(qItem) {
                qItem.progress = data.progress;
                updateQueueUI();
            }
            
            if (data.status === 'completed' || data.status === 'error') {
                clearInterval(interval);
                activeDownloads.delete(videoId);
                
                if(qItem) {
                    qItem.status = data.status;
                    updateQueueUI();
                }
                
                if (data.status === 'completed') {
                    showToast(t('success'), `${title} ${t('downloadSuccessMsg')}`, 'success');
                    // Auto-trigger browser download so the file is also saved to the user's device.
                    // Small delay ensures the server has fully flushed the file before streaming it.
                    setTimeout(() => {
                        const a = document.createElement('a');
                        a.href = `${API_URL}/downloader/file/${videoId}`;
                        // Set explicit .mp3 extension so Chrome never saves it as .txt
                        a.download = `${title}.mp3`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    }, 300);
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
            
            div.setAttribute('data-video-id', song.video_id);
            div.innerHTML = `
                <img src="${song.thumbnail || 'https://via.placeholder.com/50'}" alt="cover">
                <div class="song-info">
                    <h4>${song.title.replace(/\.(mp3|m4a|webm|ogg|flac|wav|opus)$/i, '')} <span style="font-size: 0.7rem; background: var(--success); padding: 2px 6px; border-radius: 4px; margin-left:10px;">${t('mp3Saved')}</span></h4>
                    <p>${song.artist} • ${t('downloadedAtStr')} ${dateStr}</p>
                    <p style="font-size:0.75rem; color:#64748b; margin-top: 4px;">${t('fileStr')} ${song.file_path}</p>
                </div>
                <a href="${API_URL}/downloader/file/${song.video_id}" download
                   style="margin-left: 0.5rem; text-decoration: none;">
                    <button class="action-btn" style="background: var(--primary); color: white;">${t('saveToDevice')}</button>
                </a>
                <button class="action-btn delete-btn" style="margin-left: 0.5rem;" onclick="deleteSongs(['${song.video_id}'])">🗑</button>
            `;
            historyResults.appendChild(div);
        });
    } catch (err) {
        historyLoader.style.display = 'none';
        showToast(t('error'), t('historyFailed'), 'error');
    }
}

// Bulk Delete Logic
async function deleteSongs(videoIds) {
    if(!confirm(t('confirmDelete'))) return;
    
    try {
        const res = await fetch(`${API_URL}/downloader/history`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ video_ids: videoIds })
        });
        
        showToast(t('success'), t('deleteSuccess'), 'success');
        uncheckAll();
        document.getElementById('history-results')?.classList.remove('selection-mode');
        removeCheckboxes('history-results');
        document.getElementById('multi-select-history-btn')?.classList.remove('active');
        
        if (secHistory.style.display === 'block') {
            loadHistory();
        }
    } catch (err) {
        showToast(t('error'), t('deleteFailed'), 'error');
    }
}

// Selection State Management
let selectedForDownload = [];
let selectedForDelete = [];

document.addEventListener('change', (e) => {
    if (e.target.classList.contains('song-checkbox')) {
        updateSelectionState();
    }
});

function updateSelectionState() {
    selectedForDownload = [];
    selectedForDelete = [];
    
    document.querySelectorAll('.song-checkbox:checked').forEach(cb => {
        if (cb.getAttribute('data-type') === 'download') {
            selectedForDownload.push({
                videoId: cb.getAttribute('data-video-id'),
                title: cb.getAttribute('data-title'),
                artist: cb.getAttribute('data-artist'),
                thumbnail: cb.getAttribute('data-thumbnail')
            });
        } else if (cb.getAttribute('data-type') === 'delete') {
            selectedForDelete.push(cb.getAttribute('data-video-id'));
        }
    });

    let floatingBtn = document.getElementById('floating-bulk-action-btn');
    if (!floatingBtn) {
        floatingBtn = document.createElement('button');
        floatingBtn.id = 'floating-bulk-action-btn';
        floatingBtn.style.animation = 'fadeIn 0.2s';
        floatingBtn.style.marginLeft = 'auto'; // Push to the right edge
        
        floatingBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (selectedForDownload.length > 0) {
                let delay = 0;
                selectedForDownload.forEach(track => {
                    setTimeout(() => startDownload(track.videoId, track.title, track.artist, track.thumbnail), delay);
                    delay += 1000;
                });
                uncheckAll();
                document.getElementById('album-tracks')?.classList.remove('selection-mode');
                removeCheckboxes('album-tracks');
                document.getElementById('multi-select-album-btn')?.classList.remove('active');
            } else if (selectedForDelete.length > 0) {
                deleteSongs(selectedForDelete);
            }
        });
    }

    const totalSelected = selectedForDownload.length + selectedForDelete.length;

    if (totalSelected > 0) {
        floatingBtn.style.display = 'inline-block';
        if (selectedForDownload.length > 0) {
            floatingBtn.className = 'action-btn download-btn';
            floatingBtn.innerText = `⬇ ${t('downloadSelected')} (${selectedForDownload.length})`;
        } else {
            floatingBtn.className = 'action-btn delete-btn';
            floatingBtn.innerText = `🗑 ${t('deleteSelected')} (${selectedForDelete.length})`;
        }
        
        if (lastInteractedItem && lastInteractedItem.querySelector('.song-checkbox')?.checked) {
            lastInteractedItem.appendChild(floatingBtn);
        } else {
            const anyChecked = document.querySelector('.song-checkbox:checked');
            if (anyChecked) {
                anyChecked.closest('.song-item').appendChild(floatingBtn);
            }
        }
    } else {
        if (floatingBtn.parentNode) {
            floatingBtn.parentNode.removeChild(floatingBtn);
        }
    }
}

function injectCheckboxes(containerId, type) {
    const list = document.getElementById(containerId);
    if (!list) return;
    list.querySelectorAll('.song-item').forEach(item => {
        if (!item.querySelector('.song-checkbox-container')) {
            const cbContainer = document.createElement('div');
            cbContainer.className = 'song-checkbox-container';
            
            const vid = item.getAttribute('data-video-id');
            const title = item.getAttribute('data-title') || '';
            const artist = item.getAttribute('data-artist') || '';
            const thumb = item.getAttribute('data-thumbnail') || '';
            
            cbContainer.innerHTML = `<input type="checkbox" class="song-checkbox" data-type="${type}" data-video-id="${vid}" data-title="${title}" data-artist="${artist}" data-thumbnail="${thumb}">`;
            
            item.prepend(cbContainer);
        }
    });
}

function removeCheckboxes(containerId) {
    const list = document.getElementById(containerId);
    if (!list) return;
    list.querySelectorAll('.song-checkbox-container').forEach(el => el.remove());
}

function uncheckAll() {
    document.querySelectorAll('.song-checkbox').forEach(cb => cb.checked = false);
    updateSelectionState();
}

// Drag to select functionality
let isDragSelecting = false;
let dragCheckState = true;
let lastInteractedItem = null;

document.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // Only left click
    
    // Ignore if clicking the floating action button
    if (e.target.closest('#floating-bulk-action-btn')) return;
    
    const item = e.target.closest('.song-item');
    if (!item) return;
    
    if (!item.closest('.selection-mode')) return;

    isDragSelecting = true;
    lastInteractedItem = item;
    const cb = item.querySelector('.song-checkbox');
    
    if (cb) {
        if (e.target !== cb) {
            cb.checked = !cb.checked;
            dragCheckState = cb.checked;
            updateSelectionState();
            e.preventDefault(); // Prevent text/image selection
        } else {
            // Checkbox clicked natively
            dragCheckState = !cb.checked;
        }
    }
});

document.addEventListener('mouseover', (e) => {
    if (!isDragSelecting) return;
    
    const item = e.target.closest('.song-item');
    if (!item) return;
    if (!item.closest('.selection-mode')) return;

    lastInteractedItem = item;
    const cb = item.querySelector('.song-checkbox');
    if (cb && cb.checked !== dragCheckState) {
        cb.checked = dragCheckState;
        updateSelectionState();
    }
});

document.addEventListener('mouseup', (e) => {
    if (e.button !== 0) return;
    isDragSelecting = false;
});

document.addEventListener('mouseleave', () => {
    isDragSelecting = false;
});

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

// Replaced by queue system


// ═══════════════════════════════════════════════════════════════════════════════
// SPOTIFY INTEGRATION
// ═══════════════════════════════════════════════════════════════════════════════

// ── Helper: parse Spotify URL ─────────────────────────────────────────────────
function parseSpotifyUrl(url) {
    // Matches: open.spotify.com/playlist/ID, /album/ID, /artist/ID, /track/ID
    const match = url.match(/open\.spotify\.com\/(playlist|album|artist|track)\/([A-Za-z0-9]+)/);
    if (match) return { type: match[1], id: match[2] };
    // Also handle spotify:playlist:ID URIs
    const uriMatch = url.match(/spotify:(playlist|album|artist|track):([A-Za-z0-9]+)/);
    if (uriMatch) return { type: uriMatch[1], id: uriMatch[2] };
    return null;
}

// ── Helper: format ms duration to mm:ss ──────────────────────────────────────
function formatDuration(ms) {
    if (!ms) return '';
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

// ── Spotify credentials + OAuth status ──────────────────────────────────────
async function checkSpotifyCredentials() {
    try {
        const res = await fetch(`${API_URL}/spotify/search?q=test&type=track`);
        const credsBanner = document.getElementById('spotify-creds-warning');
        if (res.status === 503) {
            credsBanner.style.display = 'flex';
            document.getElementById('spotify-login-banner').style.display = 'none';
            return false;
        }
        credsBanner.style.display = 'none';
        // Check OAuth status
        await checkSpotifyAuthStatus();
        return true;
    } catch (e) {
        return false;
    }
}

async function checkSpotifyAuthStatus() {
    try {
        const res = await fetch(`${API_URL}/spotify/auth-status`);
        const data = await res.json();
        const banner = document.getElementById('spotify-login-banner');
        const loginBtn = document.getElementById('spotify-login-btn');
        const logoutBtn = document.getElementById('spotify-logout-btn');
        const statusSpan = document.getElementById('spotify-login-status');
        const loginTitle = document.getElementById('spotify-login-title');
        const setupSteps = document.getElementById('spotify-setup-steps');

        banner.style.display = 'flex';

        if (data.logged_in) {
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'inline-block';
            statusSpan.style.display = 'inline';
            if (loginTitle) loginTitle.textContent = currentLang === 'uk' ? '✓ Spotify підключено' : '✓ Spotify Connected';
            if (setupSteps) setupSteps.style.display = 'none';
        } else {
            loginBtn.style.display = 'inline-block';
            logoutBtn.style.display = 'none';
            statusSpan.style.display = 'none';
            if (loginTitle) loginTitle.textContent = currentLang === 'uk' ? 'Підключіть Spotify для відкриття плейлистів' : 'Connect Spotify to open playlists';
            if (setupSteps) setupSteps.style.display = '';
        }
    } catch (e) {}
}

async function spotifyLogout() {
    try {
        await fetch(`${API_URL}/spotify/logout`, { method: 'POST' });
        await checkSpotifyAuthStatus();
        showToast(t('info'), 'Spotify disconnected', 'info');
    } catch (e) {}
}

// ── Spotify URL open button ───────────────────────────────────────────────────
document.getElementById('spotify-url-btn').addEventListener('click', handleSpotifyUrl);
document.getElementById('spotify-url-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSpotifyUrl();
});

async function handleSpotifyUrl() {
    const input = document.getElementById('spotify-url-input').value.trim();
    if (!input) return;

    const parsed = parseSpotifyUrl(input);
    if (!parsed) {
        showToast(t('error'), t('invalidUrlError'), 'error');
        return;
    }

    if (parsed.type === 'playlist' || parsed.type === 'album') {
        await loadSpotifyPlaylist(parsed.id, parsed.type, true);
    } else if (parsed.type === 'artist') {
        await loadSpotifyArtist(parsed.id, true);
    } else if (parsed.type === 'track') {
        // Single track: resolve and download immediately
        showToast(t('info'), t('resolving'), 'info');
        // We need some minimal info — use the URL as a hint only; 
        // we can't query the track without credentials check happening first.
        showToast(t('error'), 'For individual tracks, please use Search to find the song.', 'info');
    }
}

// ── Spotify Search ────────────────────────────────────────────────────────────
document.getElementById('spotify-search-btn').addEventListener('click', doSpotifySearch);
document.getElementById('spotify-search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') doSpotifySearch();
});

async function doSpotifySearch() {
    const query = document.getElementById('spotify-search-input').value.trim();
    const type = document.getElementById('spotify-search-type').value;
    if (!query) return;

    const loader = document.getElementById('spotify-search-loader');
    const results = document.getElementById('spotify-search-results');
    results.innerHTML = '';
    loader.style.display = 'block';

    try {
        const res = await fetch(`${API_URL}/spotify/search?q=${encodeURIComponent(query)}&type=${type}`);
        const data = await res.json();
        loader.style.display = 'none';

        if (!data || data.detail || data.length === 0) {
            results.innerHTML = `<p style="text-align:center; width:100%; grid-column: 1 / -1;">${t('nothingFound')}</p>`;
            return;
        }

        if (type === 'track') {
            results.className = 'list-container';
            data.forEach(track => {
                results.appendChild(createSpotifySongItem(track));
            });
        } else if (type === 'album') {
            results.className = 'grid-albums';
            data.forEach(album => {
                const card = document.createElement('div');
                card.className = 'spotify-playlist-card';
                card.innerHTML = `
                    <img src="${album.thumbnail}" alt="${album.title}">
                    <h4>${album.title}</h4>
                    <p>${album.artistStr} • ${album.year}</p>
                `;
                card.addEventListener('click', () => loadSpotifyPlaylist(album.id, 'album', true));
                results.appendChild(card);
            });
        } else if (type === 'playlist') {
            results.className = 'grid-albums';
            data.forEach(pl => {
                const card = document.createElement('div');
                card.className = 'spotify-playlist-card';
                card.innerHTML = `
                    <img src="${pl.thumbnail}" alt="${pl.name}">
                    <h4>${pl.name}</h4>
                    <p>${pl.owner} • ${pl.total_tracks} ${t('tracks').toLowerCase()}</p>
                `;
                card.addEventListener('click', () => loadSpotifyPlaylist(pl.id, 'playlist', true));
                results.appendChild(card);
            });
        } else if (type === 'artist') {
            results.className = 'grid-results';
            data.forEach(artist => {
                const card = document.createElement('div');
                card.className = 'artist-card';
                card.innerHTML = `
                    <img style="width:80px;height:80px;border-radius:50%;object-fit:cover;" src="${artist.thumbnail}" alt="${artist.name}">
                    <h3 style="font-size:1rem;">${artist.name}</h3>
                `;
                card.addEventListener('click', () => loadSpotifyArtist(artist.id, true));
                results.appendChild(card);
            });
        }
    } catch (err) {
        loader.style.display = 'none';
        showToast(t('error'), t('spotifySearchFailed'), 'error');
    }
}

// ── Spotify Song Item (with resolve-then-download) ────────────────────────────
function createSpotifySongItem(track) {
    const div = document.createElement('div');
    div.className = 'song-item spotify-song-item';

    const safeTitle = (track.title || '').replace(/"/g, '&quot;');
    const safeArtist = (track.artistStr || '').replace(/"/g, '&quot;');
    const safeThumb = (track.thumbnail || '').replace(/"/g, '&quot;');

    div.setAttribute('data-spotify-id', track.id);
    div.setAttribute('data-title', safeTitle);
    div.setAttribute('data-artist', safeArtist);
    div.setAttribute('data-thumbnail', safeThumb);

    const duration = formatDuration(track.duration_ms);

    div.innerHTML = `
        <img src="${track.thumbnail || 'https://via.placeholder.com/50'}" alt="cover">
        <div class="song-info">
            <h4>${track.title} <span class="spotify-badge">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#1DB954"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                Spotify
            </span></h4>
            <p>${track.artistStr}${track.album ? ' • ' + track.album : ''}</p>
        </div>
        ${duration ? `<span class="track-duration">${duration}</span>` : ''}
        <button class="download-btn spotify-resolve-btn">
            ${t('downloadToMp3')}
        </button>
    `;

    const btn = div.querySelector('.spotify-resolve-btn');
    btn.addEventListener('click', () => resolveAndDownloadSpotify(track, btn, div));

    return div;
}

// ── Resolve Spotify track → YouTube → download ────────────────────────────────
const spotifyResolveCache = {}; // Cache resolved video IDs

async function resolveAndDownloadSpotify(track, btn, itemDiv) {
    // If already resolved, download directly
    if (spotifyResolveCache[track.id]) {
        const { videoId, title, artist, thumbnail } = spotifyResolveCache[track.id];
        startDownload(videoId, title, artist, thumbnail);
        return;
    }

    // Start resolving
    btn.textContent = t('resolving');
    btn.classList.add('resolving-btn');

    try {
        const res = await fetch(
            `${API_URL}/spotify/resolve?title=${encodeURIComponent(track.title)}&artist=${encodeURIComponent(track.artistStr)}`
        );
        if (!res.ok) throw new Error('resolve failed');
        const data = await res.json();
        const videoId = data.videoId;

        // Cache result and set video-id on item for multi-select
        spotifyResolveCache[track.id] = {
            videoId,
            title: track.title,
            artist: track.artistStr,
            thumbnail: track.thumbnail
        };
        itemDiv.setAttribute('data-video-id', videoId);

        btn.classList.remove('resolving-btn');
        btn.textContent = t('downloadToMp3');
        startDownload(videoId, track.title, track.artistStr, track.thumbnail);
    } catch (e) {
        btn.classList.remove('resolving-btn');
        btn.textContent = t('downloadToMp3');
        showToast(t('error'), t('spotifyResolveFailed'), 'error');
    }
}

// ── Load Spotify Playlist or Album ────────────────────────────────────────────
let currentSpotifyTracks = [];

async function loadSpotifyPlaylist(id, type, pushState = true) {
    switchSection('spotify-playlist', false);
    if (pushState) {
        window.history.pushState({ section: 'spotify-playlist', spotifyId: id, spotifyType: type }, '', '#spotify-playlist');
    }

    const tracksContainer = document.getElementById('spotify-pl-tracks');
    const loader = document.getElementById('spotify-pl-loader');
    tracksContainer.innerHTML = '';
    loader.style.display = 'block';

    try {
        const endpoint = type === 'album' ? `album/${id}` : `playlist/${id}`;
        const res = await fetch(`${API_URL}/spotify/${endpoint}`);
        const data = await res.json();

        loader.style.display = 'none';

        if (!res.ok || data.detail) {
            throw new Error(data.detail || `HTTP ${res.status}`);
        }

        // Fill header
        document.getElementById('spotify-pl-img').src = data.thumbnail;
        document.getElementById('spotify-pl-title').textContent = data.title || data.name;

        const trackCount = data.total_tracks || (data.tracks && data.tracks.length) || 0;
        const artistStr = data.artistStr || data.owner || '';
        const year = data.year || '';
        let descParts = [];
        if (artistStr) descParts.push(artistStr);
        if (year) descParts.push(year);
        descParts.push(`${trackCount} ${t('tracks').toLowerCase()}`);
        document.getElementById('spotify-pl-desc').textContent = descParts.join(' • ');

        const titleEl = document.getElementById('spotify-pl-tracks-title');
        titleEl.setAttribute('data-i18n', type === 'album' ? 'albumTracks' : 'playlistTracks');
        titleEl.textContent = t(type === 'album' ? 'albumTracks' : 'playlistTracks');

        currentSpotifyTracks = data.tracks || [];
        currentSpotifyTracks.forEach(track => {
            tracksContainer.appendChild(createSpotifySongItem(track));
        });

    } catch (err) {
        loader.style.display = 'none';
        const msg = err.message || '';
        if (msg.includes('NEED_LOGIN')) {
            // Needs Spotify OAuth — show the login banner and go back to Spotify tab
            switchSection('spotify', true);
            await checkSpotifyAuthStatus(); // will show the banner
            showToast(t('error'),
                currentLang === 'uk'
                    ? 'Увійдіть через Spotify щоб відкривати плейлисти. Натисніть "Connect Spotify" вище.'
                    : 'Log in with Spotify to open playlists. Click "Connect Spotify" above.',
                'error');
        } else if (msg.includes('PLAYLIST_PRIVATE')) {
            showToast(t('error'), t('playlistPrivateError'), 'error');
            switchSection('spotify', true);
        } else {
            showToast(t('error'), t('spotifyLoadFailed'), 'error');
        }
    }
}

// ── Download entire Spotify playlist ─────────────────────────────────────────
document.getElementById('download-spotify-pl-btn').addEventListener('click', async () => {
    if (!currentSpotifyTracks.length) return;

    showToast(t('info'), `${t('downloadStarted')} ${currentSpotifyTracks.length} ${t('tracks').toLowerCase()}`, 'info');

    // Resolve all tracks sequentially and then queue downloads with stagger
    let delay = 0;
    for (const track of currentSpotifyTracks) {
        setTimeout(async () => {
            try {
                let videoId, title = track.title, artist = track.artistStr, thumbnail = track.thumbnail;
                if (spotifyResolveCache[track.id]) {
                    ({ videoId, title, artist, thumbnail } = spotifyResolveCache[track.id]);
                } else {
                    const res = await fetch(
                        `${API_URL}/spotify/resolve?title=${encodeURIComponent(track.title)}&artist=${encodeURIComponent(track.artistStr)}`
                    );
                    if (!res.ok) return;
                    const data = await res.json();
                    videoId = data.videoId;
                    spotifyResolveCache[track.id] = { videoId, title, artist, thumbnail };
                }
                startDownload(videoId, title, artist, thumbnail);
            } catch (e) {
                console.error('Resolve failed for', track.title, e);
            }
        }, delay);
        delay += 800;
    }
});

// ── Multi-select for Spotify playlist ─────────────────────────────────────────
document.getElementById('multi-select-spotify-btn')?.addEventListener('click', () => {
    const list = document.getElementById('spotify-pl-tracks');
    const btn = document.getElementById('multi-select-spotify-btn');
    list.classList.toggle('selection-mode');
    if (list.classList.contains('selection-mode')) {
        btn.classList.add('active');
        // We inject checkboxes, but Spotify items don't yet have video-id
        // Inject checkboxes only for resolved items
        list.querySelectorAll('.spotify-song-item').forEach(item => {
            if (!item.querySelector('.song-checkbox-container')) {
                const vid = item.getAttribute('data-video-id') || '';
                const cbContainer = document.createElement('div');
                cbContainer.className = 'song-checkbox-container';
                cbContainer.innerHTML = `<input type="checkbox" class="song-checkbox" data-type="download" data-video-id="${vid}" data-title="${item.getAttribute('data-title') || ''}" data-artist="${item.getAttribute('data-artist') || ''}" data-thumbnail="${item.getAttribute('data-thumbnail') || ''}">`;
                item.prepend(cbContainer);
            }
        });
    } else {
        btn.classList.remove('active');
        uncheckAll();
        removeCheckboxes('spotify-pl-tracks');
    }
});

// ── Load Spotify Artist ───────────────────────────────────────────────────────
async function loadSpotifyArtist(id, pushState = true) {
    switchSection('spotify-artist', false);
    if (pushState) {
        window.history.pushState({ section: 'spotify-artist', spotifyId: id }, '', '#spotify-artist');
    }

    const albumsContainer = document.getElementById('spotify-artist-albums');
    albumsContainer.innerHTML = '<div class="loader"></div>';

    try {
        const res = await fetch(`${API_URL}/spotify/artist/${id}`);
        const data = await res.json();
        if (data.detail) throw new Error(data.detail);

        document.getElementById('spotify-artist-img').src = data.thumbnail;
        document.getElementById('spotify-artist-name').textContent = data.name;

        let meta = [];
        if (data.genres && data.genres.length) meta.push(data.genres.slice(0, 3).join(', '));
        if (data.followers) meta.push(`${data.followers.toLocaleString()} followers`);
        document.getElementById('spotify-artist-meta').textContent = meta.join(' • ');

        albumsContainer.innerHTML = '';
        if (data.albums && data.albums.length) {
            data.albums.forEach(album => {
                const card = document.createElement('div');
                card.className = 'spotify-playlist-card';
                card.innerHTML = `
                    <img src="${album.thumbnail}" alt="${album.title}">
                    <h4>${album.title}</h4>
                    <p>${album.type === 'single' ? 'Single' : 'Album'} • ${album.year}</p>
                `;
                card.addEventListener('click', () => loadSpotifyPlaylist(album.id, 'album', true));
                albumsContainer.appendChild(card);
            });
        } else {
            albumsContainer.innerHTML = `<p>${t('noAlbums')}</p>`;
        }
    } catch (err) {
        showToast(t('error'), t('spotifyLoadFailed'), 'error');
    }
}

// ── Back buttons ─────────────────────────────────────────────────────────────
document.getElementById('back-to-spotify').addEventListener('click', () => history.back());
document.getElementById('back-to-spotify-from-artist').addEventListener('click', () => history.back());

// ── Check credentials on Spotify tab open ─────────────────────────────────────
navSpotify.addEventListener('click', () => {
    checkSpotifyCredentials();
});
