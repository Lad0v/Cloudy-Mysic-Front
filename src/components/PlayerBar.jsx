import React, { useState, useRef, useEffect } from 'react';
import { 
  FaStepBackward, 
  FaPlay, 
  FaPause, 
  FaStepForward, 
  FaVolumeUp, 
  FaVolumeMute 
} from 'react-icons/fa';
import { HeartIcon, HeartFilledIcon } from './icons/MediaIcons.jsx';
import { playUrl, pause, getCurrent, onChange, offChange, seek, setVolume as playerSetVolume, getTime, getDuration, nextTrack, prevTrack } from '../lib/player';

const PlayerBar = () => {
  // Состояние для управления воспроизведением
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // 3 минуты в секундах
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const LOVED_KEY = 'cloudy_liked_tracks';
  const PLAYLISTS_KEY = 'cloudy_playlists';
  const RECENTS_KEY = 'cloudy_recent_tracks';

  // Current metadata will be provided by singleton player
  const [currentMeta, setCurrentMeta] = useState({ id: null, title: 'Cloudy Music', artist: 'Cloudy Music', imageUrl: '' });
  
  // Короткая подсветка фокуса: убираем фокус через 800мс после клика
  const transientBlur = (e) => {
    const target = e.currentTarget;
    setTimeout(() => {
      // Проверяем, что элемент все еще смонтирован
      if (target && typeof target.blur === 'function') target.blur();
    }, 800);
  };

  // Инициализируем лайк из localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOVED_KEY);
      const arr = raw ? (JSON.parse(raw) || []) : [];
      setIsLiked(arr.some((t) => t.id === currentMeta?.id));
    } catch {}
  }, [currentMeta]);

  // Helpers to sync Like with Favorites playlist in localStorage
  const loadPlaylists = () => {
    try {
      const raw = localStorage.getItem(PLAYLISTS_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const savePlaylists = (items) => {
    try { localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(items)); } catch {}
  };

  const ensureFavorites = (items) => {
    const idx = items.findIndex(p => p.id === 'fav');
    if (idx === -1) {
      const fav = {
        id: 'fav',
        name: 'Любимое',
        createdAt: Date.now(),
        imageUrl: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=800&q=80',
        tracks: [],
      };
      return [...items, fav];
    }
    // make sure tracks array exists
    if (!Array.isArray(items[idx].tracks)) {
      const copy = items.slice();
      copy[idx] = { ...copy[idx], tracks: [] };
      return copy;
    }
    return items;
  };

  const addToFavorites = (track) => {
    if (!track?.id) return;
    let items = ensureFavorites(loadPlaylists());
    const idx = items.findIndex(p => p.id === 'fav');
    const fav = items[idx];
    // avoid duplicates by id
    const exists = fav.tracks?.some(t => t.id === track.id);
    if (!exists) {
      const nextFav = { ...fav, tracks: [{ ...track, addedAt: Date.now() }, ...(fav.tracks || [])] };
      items = items.slice();
      items[idx] = nextFav;
      savePlaylists(items);
    }
  };

  const removeFromFavorites = (trackId) => {
    if (!trackId) return;
    let items = ensureFavorites(loadPlaylists());
    const idx = items.findIndex(p => p.id === 'fav');
    const fav = items[idx];
    const nextFav = { ...fav, tracks: (fav.tracks || []).filter(t => t.id !== trackId) };
    items = items.slice();
    items[idx] = nextFav;
    savePlaylists(items);
  };

  // local refs for progress/volume UI (player drives audio element)
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const volumeBarRef = useRef(null);
  
  // Форматирование времени в минуты:секунды
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Обработчик изменения времени воспроизведения
  const handleTimeUpdate = () => {
    setCurrentTime(getTime());
  };
  
  // Обработчик перемотки
  const handleSeek = (e) => {
    const progressBar = progressBarRef.current;
    const clickPosition = e.nativeEvent.offsetX;
    const progressBarWidth = progressBar.clientWidth;
    const seekTime = (clickPosition / progressBarWidth) * duration;
    seek(seekTime);
    setCurrentTime(seekTime);
  };
  
  // Обработчик изменения громкости
  const handleVolumeChange = (e) => {
    const volumeBar = volumeBarRef.current;
    const clickPosition = e.nativeEvent.offsetX;
    const volumeBarWidth = volumeBar.clientWidth;
    const newVolume = (clickPosition / volumeBarWidth) * 100;
    
  const bounded = Math.min(100, Math.max(0, newVolume));
  setVolume(bounded);
  // call player setVolume in 0..1
  try { playerSetVolume(bounded / 100); } catch {}
    
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    } else if (newVolume === 0 && !isMuted) {
      setIsMuted(true);
    }
  };
  
  // Обработчик переключения звука
  const toggleMute = () => {
    if (isMuted) {
      playerSetVolume(volume / 100);
      setIsMuted(false);
    } else {
      playerSetVolume(0);
      setIsMuted(true);
    }
  };
  
  // Subscribe to global player changes
  useEffect(() => {
    const h = (ev) => {
      const { url, playing, meta } = ev.detail;
      setIsPlaying(Boolean(playing));
      setCurrentMeta(meta || { id: null, title: 'Cloudy Music', artist: 'Cloudy Music', imageUrl: '' });
      // Note: we can't access the audio element here directly, so we don't try to read currentTime.
    };
    onChange(h);
    // initialize from current player
    const cur = getCurrent();
    setIsPlaying(Boolean(cur.playing));
    setCurrentMeta(cur.meta || { id: null, title: 'Cloudy Music', artist: 'Cloudy Music', imageUrl: '' });
    return () => offChange(h);
  }, []);

  // Poll time/duration periodically so UI can update (player provides getters)
  useEffect(() => {
    const id = setInterval(() => {
      try {
        setCurrentTime(getTime());
        setDuration(getDuration() || duration);
      } catch {}
    }, 500);
    return () => clearInterval(id);
  }, [duration]);
  
  // We no longer manage a local <audio> element for playback. Controls call singleton API.
  
  // PlayerBar UI - shows metadata from singleton player and uses player API for controls
  return (
    <div className="player-bar">
        <div className="now-playing">
          <div className="album-art">
            {currentMeta && currentMeta.imageUrl ? (
              <img src={currentMeta.imageUrl} alt={currentMeta.title} style={{ inlineSize: 64, blockSize: 64, borderRadius: 8, objectFit: 'cover' }} />
            ) : (
              <div className="album-art-placeholder">
                <span>Cloudy Music</span>
              </div>
            )}
          </div>
          <div className="track-info">
            <div className="track-title">{currentMeta?.title || 'Cloudy Music'}</div>
            <div className="track-artist">{currentMeta?.artist || 'Cloudy Music'}</div>
          </div>
          <button
            className="control-button"
            aria-label={isLiked ? 'Убрать из избранного' : 'Добавить в избранное'}
            title={isLiked ? 'Убрать из избранного' : 'Добавить в избранное'}
            onClick={(e) => {
              setIsLiked((v) => !v);
                // Переключаем лайк в localStorage
                try {
                  const raw = localStorage.getItem(LOVED_KEY);
                  const arr = raw ? (JSON.parse(raw) || []) : [];
                  const exists = arr.some((t) => t.id === currentMeta?.id);
                  let next;
                  if (exists) {
                    next = arr.filter((t) => t.id !== currentMeta?.id);
                    // sync: remove from Favorites playlist as well
                    removeFromFavorites(currentMeta?.id);
                  } else {
                    next = [{ id: currentMeta?.id, title: currentMeta?.title, artist: currentMeta?.artist, imageUrl: currentMeta?.imageUrl, likedAt: Date.now() }, ...arr];
                    // sync: add to Favorites playlist
                    addToFavorites({ id: currentMeta?.id, title: currentMeta?.title, artist: currentMeta?.artist, imageUrl: currentMeta?.imageUrl });
                  }
                  localStorage.setItem(LOVED_KEY, JSON.stringify(next));
                } catch {}
              transientBlur(e);
            }}
            style={{ marginInlineStart: 12 }}
          >
            {isLiked ? <HeartFilledIcon size={18} /> : <HeartIcon size={18} />}
          </button>
        </div>
        
        <div className="player-controls">
          <div className="control-buttons">
            <button 
              className="control-button"
              onClick={(e) => {
                try { prevTrack(); } catch {}
                transientBlur(e);
              }}
            >
              <FaStepBackward />
            </button>
            <button 
              className="play-button"
              onClick={(e) => {
                if (isPlaying) {
                  pause();
                } else {
                  // if there's a current url, toggle play; otherwise do nothing
                  const cur = getCurrent();
                  if (cur.url) playUrl(cur.url, cur.meta || null);
                }
                transientBlur(e);
              }}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button 
              className="control-button"
              onClick={(e) => {
                try { nextTrack(); } catch {}
                transientBlur(e);
              }}
            >
              <FaStepForward />
            </button>
          </div>
          
          <div className="progress-container">
            <div className="progress-time">{formatTime(currentTime)}</div>
            <div 
              className="progress-bar" 
              ref={progressBarRef}
              onClick={handleSeek}
            >
              <div 
                className="progress-fill" 
                style={{ inlineSize: `${(currentTime / duration) * 100}%` }}
              ></div>
            </div>
            <div className="progress-time">{formatTime(duration)}</div>
          </div>
        </div>
        
        <div className="volume-control">
          <button 
            className="volume-button"
            onClick={(e) => { toggleMute(); transientBlur(e); }}
          >
            {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
          <div 
            className="volume-bar"
            ref={volumeBarRef}
            onClick={handleVolumeChange}
          >
            <div 
              className="volume-level"
              style={{ inlineSize: `${isMuted ? 0 : volume}%` }}
            ></div>
          </div>
        </div>
    </div>
  );
};

export default PlayerBar;
