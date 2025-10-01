// Simple singleton audio player with change events
const audio = new Audio();
let currentSource = null;
let isPlayingFlag = false;
let currentMeta = null; // { title, artist, imageUrl, id }

const events = new EventTarget();

function emitChange() {
  events.dispatchEvent(new CustomEvent('change', { detail: { url: currentSource, playing: isPlayingFlag, meta: currentMeta } }));
}

export function playUrl(url, meta = null) {
  if (!url) return;
  console.log('[player] playUrl called with', url, meta);
  if (currentSource === url) {
    // toggle pause/play for same source
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
    // playback events will update flags and emit
    return;
  }
  // switch to new source
  currentSource = url;
  currentMeta = meta;
  audio.src = url;
  audio.play().then(() => {
    // success
    console.log('[player] playback started for', url);
    emitChange();
  }).catch(err => {
    console.warn('[player] Playback failed for', url, err);
    emitChange();
  });
}

export function pause() {
  audio.pause();
}

export function seek(timeInSeconds) {
  try {
    audio.currentTime = Number(timeInSeconds) || 0;
  } catch (e) {
    console.warn('[player] seek failed', e);
  }
}

export function setVolume(vol) {
  try {
    audio.volume = Math.max(0, Math.min(1, Number(vol)));
  } catch (e) {
    console.warn('[player] setVolume failed', e);
  }
}

export function isPlaying() {
  return isPlayingFlag;
}

export function getCurrent() {
  return { url: currentSource, playing: isPlayingFlag, meta: currentMeta };
}

export function getTime() {
  try {
    return audio.currentTime || 0;
  } catch (e) {
    return 0;
  }
}

export function getDuration() {
  try {
    return audio.duration || 0;
  } catch (e) {
    return 0;
  }
}

export function onChange(cb) {
  events.addEventListener('change', cb);
}

export function offChange(cb) {
  events.removeEventListener('change', cb);
}

// wire audio element events to update flag + emit
audio.addEventListener('play', () => {
  isPlayingFlag = true;
  emitChange();
});
audio.addEventListener('pause', () => {
  isPlayingFlag = false;
  emitChange();
});
audio.addEventListener('ended', () => {
  isPlayingFlag = false;
  emitChange();
});

export default { playUrl, pause, isPlaying, getCurrent, onChange, offChange };
