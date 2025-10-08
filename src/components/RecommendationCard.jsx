import React, { useState, useEffect } from 'react';
import { PlayIcon, PauseIcon } from './icons/MediaIcons.jsx';
import player, { playUrl, onChange, offChange, getCurrent } from '../lib/player';

const RecommendationCard = ({ title, subtitle, imageUrl, onClick, audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (!audioUrl) return;
    console.log('[RecommendationCard] togglePlay called for', title, audioUrl);
    // pass metadata so PlayerBar can display info
    playUrl(audioUrl, { title, artist: subtitle, imageUrl, id: title });
    // actual playing state will update via player events
  };

  useEffect(() => {
    const handle = (ev) => {
      const { url, playing } = ev.detail;
      console.log('[RecommendationCard] player event', { url, playing, cardUrl: audioUrl });
      setIsPlaying(Boolean(url && audioUrl && url === audioUrl && playing));
    };
    onChange(handle);
    // set initial state
    const cur = getCurrent();
    setIsPlaying(Boolean(cur.url && audioUrl && cur.url === audioUrl && cur.playing));
    return () => offChange(handle);
  }, [audioUrl]);

  return (
    <div className="recommendation-card" onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
      <div className="card-image">
        <img 
          src={imageUrl} 
          alt={title} 
          loading="lazy" 
          decoding="async"
          onError={(e) => {
            if (e.currentTarget.src.indexOf('/placeholder.png') === -1) {
              e.currentTarget.src = '/placeholder.png';
            }
          }}
        />
        <button 
          className="card-play-button" 
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <PauseIcon size={22} /> : <PlayIcon size={22} />}
        </button>
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-subtitle">{subtitle}</p>
      </div>
    </div>
  );
};

export default RecommendationCard;
