import React, { useEffect, useState } from 'react';
import RecommendationCard from '../components/RecommendationCard';
import { playUrl, playAlbum } from '../lib/player';
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

  // like state persisted in localStorage
  const storageKey = 'cloudy_album_likes';
  const [liked, setLiked] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      const obj = raw ? JSON.parse(raw) : {};
      return Boolean(obj[album.id]);
    } catch { return false; }
  });

  const toggleLike = () => {
    try {
      const raw = localStorage.getItem(storageKey);
      const obj = raw ? JSON.parse(raw) : {};
      if (liked) delete obj[album.id]; else obj[album.id] = true;
      localStorage.setItem(storageKey, JSON.stringify(obj));
      setLiked(!liked);
    } catch {/* ignore */}
  };

  return (
    <div className="album-page album-layout album-header-new">
      <div className="album-header-row">
        <div className="album-cover-frame-lg">
          <img
            className="album-cover-lg"
            src={album.imageUrl}
            alt={album.title}
            loading="lazy"
            decoding="async"
            onError={(e)=>{ if(!e.currentTarget.src.endsWith('/placeholder.png')) e.currentTarget.src='/placeholder.png'; }}
          />
        </div>
        <div className="album-head-text">
          <h1 className="album-title">{album.title}</h1>
          <p className="album-artist">{album.artist}</p>
          <div className="album-buttons-row">
            <button
              className="album-play-btn"
              onClick={() => playAlbum(album, 0)}
            >▶ Play</button>
            <button
              className={"album-like-btn" + (liked ? ' liked' : '')}
              onClick={toggleLike}
              aria-pressed={liked}
            >{liked ? '♥ Liked' : '♡ Like'}</button>
          </div>
        </div>
      </div>
      <div className="album-tracks-wrap">
        <h3 className="album-tracks-heading">Треки альбома</h3>
        <div className="recommendations-grid">
          {album.tracks?.map((track, idx) => (
            <RecommendationCard
              key={track.id}
              title={track.title}
              subtitle={track.artist}
              imageUrl={track.imageUrl || album.imageUrl}
              audioUrl={track.audioUrl}
              onClick={() => { 
                // Play album starting at this track index so queue is established
                playAlbum(album, idx);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlbumMusic;
