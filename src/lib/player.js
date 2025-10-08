// Simple singleton audio player with queue + change events
const audio = new Audio();
let currentSource = null;
let isPlayingFlag = false;
let currentMeta = null; // { title, artist, imageUrl, id, albumId, albumTitle, index }

// Queue/album state
let queue = []; // [{ url, meta }]
let queueIndex = -1;
let currentAlbumId = null; // reference to album/playlist id for navigation

const events = new EventTarget();

function emitChange(extra = {}) {
  events.dispatchEvent(new CustomEvent('change', { detail: { url: currentSource, playing: isPlayingFlag, meta: currentMeta, queueIndex, queueLength: queue.length, albumId: currentAlbumId, ...extra } }));
}

function internalPlayEntry(idx) {
  if (idx < 0 || idx >= queue.length) return;
  queueIndex = idx;
  const entry = queue[idx];
  currentSource = entry.url;
  currentMeta = entry.meta;
  audio.src = entry.url;
  audio.play().then(() => {
    console.log('[player] playback started idx', idx, entry);
    emitChange();
  }).catch(err => {
    console.warn('[player] Playback failed for', entry.url, err);
    emitChange({ error: err?.message });
  });
}

export function clearQueue() {
  queue = [];
  queueIndex = -1;
  currentAlbumId = null;
  // do not stop playback explicitly; caller may call pause() if desired
  emitChange();
}

export function playUrl(url, meta = null) {
  if (!url) return;
  console.log('[player] playUrl called with', url, meta);
  // If this url is current, toggle play/pause
  if (currentSource === url) {
    if (audio.paused) audio.play(); else audio.pause();
    return; // events from audio element will propagate
  }
  // Replace queue with just this single track context
  queue = [{ url, meta }];
  currentAlbumId = meta?.albumId || null;
  internalPlayEntry(0);
}

export function playAlbum(album, startIndex = 0) {
  try {
    if (!album) return;
    // album: { id, title, artist, imageUrl, tracks:[{audioUrl, title, artist, imageUrl, id}] }
    const tracks = (album.tracks || []).filter(t => t.audioUrl);
    if (!tracks.length) return;
    queue = tracks.map((t, i) => ({
      url: t.audioUrl,
      meta: {
        id: t.id,
        title: t.title,
        artist: t.artist || album.artist,
        imageUrl: t.imageUrl || album.imageUrl,
        albumId: album.id,
        albumTitle: album.title,
        index: i,
        total: tracks.length
      }
    }));
    currentAlbumId = album.id;
    const idx = Math.min(Math.max(0, startIndex), queue.length - 1);
    internalPlayEntry(idx);
  } catch (e) {
    console.warn('[player] playAlbum failed', e);
  }
}

export function nextTrack() {
  if (queueIndex + 1 < queue.length) {
    internalPlayEntry(queueIndex + 1);
  } else {
    // end of queue -> pause and keep last track meta
    pause();
  }
}

export function prevTrack() {
  if (queueIndex > 0) {
    internalPlayEntry(queueIndex - 1);
  } else if (queueIndex === 0) {
    // restart current
    internalPlayEntry(0);
  }
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
  return { url: currentSource, playing: isPlayingFlag, meta: currentMeta, queueIndex, queueLength: queue.length, albumId: currentAlbumId };
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
  // auto-advance if queue not finished
  if (queueIndex >= 0 && queueIndex + 1 < queue.length) {
    nextTrack();
  } else {
    emitChange();
  }
});

export default { playUrl, playAlbum, nextTrack, prevTrack, clearQueue, pause, isPlaying, getCurrent, onChange, offChange };
