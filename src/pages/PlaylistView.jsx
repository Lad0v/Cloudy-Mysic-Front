import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'cloudy_playlists';

function loadPlaylists() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getPlaylistIdFromHash() {
  const hash = window.location.hash || '';
  const m = hash.match(/#\/playlist\/([^/?#]+)/) || hash.match(/\/playlist\/([^/?#]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

const FAVORITE_DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=800&q=80';

export default function PlaylistView() {
  const [playlist, setPlaylist] = useState(null);

  const load = () => {
    const id = getPlaylistIdFromHash();
    if (!id) { setPlaylist(null); return; }
    const items = loadPlaylists();
    const pl = items.find(p => p.id === id);
    setPlaylist(pl || null);
  };

  useEffect(() => {
    load();
    const onHash = () => load();
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (!playlist) return <div className="album-page">Плейлист не найден</div>;

  return (
    <div className="album-page playlist-view-layout">
      <div className="playlist-view-header">
        <div className="playlist-cover-frame">
          <img
            src={playlist.imageUrl || FAVORITE_DEFAULT_IMAGE}
            alt={playlist.name}
            loading="lazy"
            decoding="async"
            onError={(e)=>{ if(!e.currentTarget.src.endsWith('/placeholder.png')) e.currentTarget.src='/placeholder.png'; }}
          />
        </div>
        <div className="playlist-view-text">
          <h1 className="playlist-view-title">{playlist.name}</h1>
          <p className="playlist-view-sub">Плейлист пользователя</p>
          <div className="playlist-view-actions">
            <button className="album-play-btn" disabled>Play (todo)</button>
            <button className="album-like-btn" disabled>Like (todo)</button>
          </div>
        </div>
      </div>
      <div className="playlist-view-tracks">
        <h3 className="album-tracks-heading">Треки плейлиста</h3>
        <div className="muted-text">Пока заглушка: треки не сохранены в структуре плейлиста. Добавить поле tracks[] позже.</div>
      </div>
    </div>
  );
}
