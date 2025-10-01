import React, { useEffect, useState } from 'react';
import RecommendationCard from '../components/RecommendationCard';
import { playUrl } from '../lib/player';
import './Home.css';
import music from '../data/musicData'; // экспортирует { albumData, allTracks }

function getAlbumFromHash() {
  try {
    const hash = window.location.hash || '';
    const match = hash.match(/\/album\/([^\/?#]+)/);
    const key = match ? match[1] : null;
    if (!key) return null;
    // предполагаем, что albumData экспортирует объект albums по ключу
  const data = music.albumData || {};
  return data[key] || null;
  } catch (e) {
    return null;
  }
}

const AlbumMusic = () => {
  const [album, setAlbum] = useState(() => getAlbumFromHash());

  useEffect(() => {
    const onHash = () => setAlbum(getAlbumFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (!album) return <div className="album-page">Альбом не найден</div>;

  return (
    <div className="album-page">
      {/* Album Info */}
      <div className="album-header">
        <div className="album-cover">
          <img src={album.imageUrl} alt={album.title} loading="lazy" decoding="async" />
        </div>
        <div className="album-info">
          <h1>{album.title}</h1>
          <p>{album.artist}</p>
          <div className="album-controls">
            <button onClick={() => playUrl(album.tracks?.[0]?.audioUrl, { id: album.id, title: album.title, artist: album.artist, imageUrl: album.imageUrl })}>
              ▶ Запустить
            </button>
            <button onClick={() => {/* like logic */}}>
              ♡
            </button>
          </div>
        </div>
      </div>

      {/* Tracks as Cards */}
      <div>
        <h3 style={{ marginBottom: 12 }}>Треки альбома:</h3>
        <div className="recommendations-grid">
          {album.tracks?.map(track => (
            <RecommendationCard
              key={track.id}
              title={track.title}
              subtitle={track.artist}
              imageUrl={track.imageUrl || album.imageUrl}
              audioUrl={track.audioUrl}
              onClick={() => {
                window.location.hash = `#/album/${album.id}/track/${track.id}`;
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlbumMusic;
