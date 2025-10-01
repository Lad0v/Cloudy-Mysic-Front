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
    <div className="album-page">
      <div className="album-header">
        <div className="album-cover">
          <img src={playlist.imageUrl || '/placeholder.png'} alt={playlist.name} onError={(e)=>{e.currentTarget.src='/placeholder.png';}} />
        </div>
        <div className="album-info">
          <h1>{playlist.name}</h1>
          <p>Плейлист пользователя</p>
        </div>
      </div>
      <div style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 12 }}>Треки: (пока заглушка)</h3>
        <div className="muted-text">Функционал треков плейлиста не реализован (нужно хранить список треков в объекте плейлиста).</div>
      </div>
    </div>
  );
}
