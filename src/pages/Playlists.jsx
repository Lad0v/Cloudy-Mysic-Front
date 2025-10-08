import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'cloudy_playlists';

function loadPlaylists() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return null;
  } catch {
    return null;
  }
}

function savePlaylists(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

const FAVORITE_DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=800&q=80'; // vibrant heart-like abstract

export default function Playlists() {
  const [playlists, setPlaylists] = useState(() => {
    const fromStorage = loadPlaylists();
    return (
      fromStorage ?? [
        { id: 'fav', name: 'Любимое', createdAt: Date.now(), imageUrl: FAVORITE_DEFAULT_IMAGE },
      ]
    );
  });

  // one‑off migration: replace legacy placeholder heart with new themed image
  useEffect(() => {
    setPlaylists(prev => {
      let changed = false;
      const updated = prev.map(p => {
        if (p.id === 'fav' && p.imageUrl && p.imageUrl.startsWith('https://via.placeholder.com/300x300?text=%E2%99%A5')) {
          changed = true;
          return { ...p, imageUrl: FAVORITE_DEFAULT_IMAGE };
        }
        return p;
      });
      if (changed) savePlaylists(updated);
      return changed ? updated : prev;
    });
  }, []);

  useEffect(() => {
    savePlaylists(playlists);
  }, [playlists]);

  const goCreate = () => {
    window.location.hash = '#/playlists/create';
  };

  return (
    <div className="playlists-page">
      <h1>Мои плейлисты</h1>
      <div className="recommendations-grid" style={{ paddingTop: 0 }}>
        {playlists.map((pl) => (
          <div
            key={pl.id}
            className="recommendation-card playlist-card"
            role="button"
            onClick={() => { window.location.hash = `#/playlist/${pl.id}`; }}
            tabIndex={0}
            onKeyDown={(e)=>{ if(e.key==='Enter' || e.key===' '){ window.location.hash = `#/playlist/${pl.id}`; } }}
          >
            <div className="card-image">
              <img
                src={pl.imageUrl || FAVORITE_DEFAULT_IMAGE}
                alt={pl.name}
                loading="lazy"
                decoding="async"
                onError={(e)=>{ if(!e.currentTarget.src.endsWith('/placeholder.png')) e.currentTarget.src='/placeholder.png'; }}
              />
            </div>
            <button className="card-play-button" aria-label="Открыть">▶</button>
            <div className="card-content">
              <div className="card-title">{pl.name}</div>
              <div className="card-subtitle">Плейлист</div>
            </div>
          </div>
        ))}

        <div className="recommendation-card add-card" onClick={goCreate} role="button" tabIndex={0}
             onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && goCreate()}>
          <div className="card-image add-card-image">
            <button className="add-circle" aria-label="Создать плейлист">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>
          <div className="card-content">
            <div className="card-title">Новый плейлист</div>
            <div className="card-subtitle">Добавить</div>
          </div>
        </div>
      </div>
    </div>
  );
}
