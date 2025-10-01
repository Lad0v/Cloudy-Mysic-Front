import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// LocalStorage keys
const UPLOADS_KEY = 'cloudy_uploads';
const ALBUMS_KEY = 'cloudy_albums';
const NEW_RELEASES_KEY = 'cloudy_new_releases';

function readList(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function writeList(key, list) {
  localStorage.setItem(key, JSON.stringify(list));
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

function formatDate(ts) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return '';
  }
}

export default function MyMusic() {
  const [uploads, setUploads] = useState(() => readList(UPLOADS_KEY, []));
  const [albums, setAlbums] = useState(() => readList(ALBUMS_KEY, []));
  const [statusMsg, setStatusMsg] = useState('');
  const inputRef = useRef(null);
  const albumDirInputRef = useRef(null);
  const revokeQueueRef = useRef([]);
  const revokeCoversRef = useRef([]);

  // Persist uploads list on change
  useEffect(() => {
    writeList(UPLOADS_KEY, uploads);
  }, [uploads]);

  // Persist albums list on change
  useEffect(() => {
    writeList(ALBUMS_KEY, albums);
  }, [albums]);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      revokeQueueRef.current.forEach((url) => URL.revokeObjectURL(url));
      revokeQueueRef.current = [];
      revokeCoversRef.current.forEach((url) => URL.revokeObjectURL(url));
      revokeCoversRef.current = [];
    };
  }, []);

  const onPickFiles = () => inputRef.current?.click();
  const onPickAlbum = () => albumDirInputRef.current?.click();

  const addFiles = useCallback((fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) {
      setStatusMsg('Файлы не выбраны.');
      return;
    }

    // Фильтруем только аудио
    const audioFiles = files.filter((f) => f.type && f.type.startsWith('audio/'));
    if (audioFiles.length === 0) {
      setStatusMsg('Выберите аудио-файлы (поддерживается тип audio/*).');
      return;
    }

    const now = Date.now();
    const newItems = audioFiles.map((file) => {
      let url = '';
      try {
        url = URL.createObjectURL(file);
      } catch {}
      revokeQueueRef.current.push(url);
      return {
        id: `${now}_${Math.random().toString(36).slice(2)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        createdAt: now,
        status: 'processing', // processing | published
        url, // preview/playback (local only)
      };
    });

    setUploads((prev) => [...newItems, ...prev]);
  }, []);

  const onInputChange = (e) => {
    addFiles(e.target.files);
    // Сбрасываем значение, чтобы повторный выбор тех же файлов сработал
    e.target.value = '';
  };

  // Build album from a selected folder (webkitdirectory)
  const addAlbumFromDirectory = useCallback((fileList) => {
    const files = Array.from(fileList || []);
    const audioFiles = files.filter((f) => f.type.startsWith('audio/'));
    if (audioFiles.length === 0) return;

    // Try to infer album name from the first file's relative path
    const first = audioFiles[0];
    const rel = first.webkitRelativePath || first.name;
    const albumName = rel.includes('/') ? rel.split('/')[0] : `Альбом ${new Date().toLocaleDateString()}`;
    const albumId = `alb_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const now = Date.now();

    setAlbums((prev) => [
      {
        id: albumId,
        name: albumName,
        createdAt: now,
        status: 'processing', // processing | published
        coverUrl: '',
      },
      ...prev,
    ]);

    // Create upload items linked to this album
    const newItems = audioFiles.map((file, idx) => {
      const url = URL.createObjectURL(file);
      revokeQueueRef.current.push(url);
      return {
        id: `${now}_${idx}_${Math.random().toString(36).slice(2)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        createdAt: now,
        status: 'processing',
        url,
        albumId,
        coverUrl: '',
      };
    });

    setUploads((prev) => [...newItems, ...prev]);
  }, []);

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addFiles(e.dataTransfer.files);
  };
  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeItem = (id) => {
    setUploads((prev) => prev.filter((x) => x.id !== id));
    try {
      const releases = readList(NEW_RELEASES_KEY, []);
      const filtered = releases.filter((r) => r.id !== id);
      writeList(NEW_RELEASES_KEY, filtered);
    } catch {}
  };

  const removeAlbum = (albumId) => {
    setAlbums((prev) => prev.filter((a) => a.id !== albumId));
    setUploads((prev) => prev.filter((u) => u.albumId !== albumId));
  };

  const renameTrack = (id, newName) => {
    setUploads((prev) => prev.map((u) => (u.id === id ? { ...u, name: newName } : u)));
  };

  const renameAlbum = (albumId, newName) => {
    setAlbums((prev) => prev.map((a) => (a.id === albumId ? { ...a, name: newName } : a)));
  };

  const onTrackCoverChange = (id, file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    revokeCoversRef.current.push(url);
    setUploads((prev) => prev.map((u) => (u.id === id ? { ...u, coverUrl: url } : u)));
  };

  const onTrackCoverUrl = (id) => {
    const url = prompt('URL изображения (jpg/png/webp)...');
    if (!url) return;
    // Простейшая валидация
    if (!/^https?:\/\//i.test(url)) {
      alert('Некорректный URL');
      return;
    }
    setUploads((prev) => prev.map((u) => (u.id === id ? { ...u, coverUrl: url } : u)));
  };

  const onAlbumCoverChange = (albumId, file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    revokeCoversRef.current.push(url);
    setAlbums((prev) => prev.map((a) => (a.id === albumId ? { ...a, coverUrl: url } : a)));
  };

  const onAlbumCoverUrl = (albumId) => {
    const url = prompt('URL изображения (jpg/png/webp)...');
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) {
      alert('Некорректный URL');
      return;
    }
    setAlbums((prev) => prev.map((a) => (a.id === albumId ? { ...a, coverUrl: url } : a)));
  };

  const published = useMemo(() => uploads.filter((u) => u.status === 'published'), [uploads]);
  const processing = useMemo(() => uploads.filter((u) => u.status === 'processing'), [uploads]);

  // Publish a single track
  const publishTrack = (id) => {
    setUploads((prev) => {
      const next = prev.map((u) => (u.id === id ? { ...u, status: 'published', publishedAt: Date.now() } : u));
      try {
        const item = next.find((u) => u.id === id);
        if (item && item.status === 'published') {
          const releases = readList(NEW_RELEASES_KEY, []);
          const filtered = releases.filter((r) => r.id !== item.id);
          filtered.unshift({
            id: item.id,
            title: item.name,
            artist: 'Я',
            imageUrl: item.coverUrl || 'https://via.placeholder.com/300x300?text=Upload',
            uploadedAt: item.publishedAt || Date.now(),
            albumId: item.albumId,
          });
          writeList(NEW_RELEASES_KEY, filtered.slice(0, 100));
        }
      } catch {}

      // If belongs to an album, recalc its status
      const itemAfter = next.find((u) => u.id === id);
      if (itemAfter?.albumId) {
        const albumId = itemAfter.albumId;
        setAlbums((prevAlb) => {
          const belong = next.filter((t) => t.albumId === albumId);
          const allPublished = belong.length > 0 && belong.every((t) => t.status === 'published');
          return prevAlb.map((a) => (a.id === albumId ? { ...a, status: allPublished ? 'published' : 'processing' } : a));
        });
      }

      return next;
    });
  };

  return (
    <div className="my-music-page">
      <h1>Моя музыка</h1>
      {statusMsg && (
        <div className="muted-text" style={{ marginTop: 8 }}>{statusMsg}</div>
      )}

      <section style={{ marginTop: 16 }}>
        <div
          className="upload-dropzone"
          onDrop={onDrop}
          onDragOver={onDragOver}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onPickFiles()}
          style={{
            border: '2px dashed rgba(255,255,255,0.2)',
            borderRadius: 16,
            padding: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            background: 'rgba(255,255,255,0.04)',
            minHeight: 160
          }}
        >
          <div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>Загрузите треки</div>
            <div className="muted-text">Перетащите файлы сюда или выберите на устройстве. Поддерживаются аудио-файлы.</div>
          </div>
          <div>
            <button className="search-button" onClick={onPickFiles}>Выбрать файлы</button>
            <button className="search-button" style={{ marginLeft: 8 }} onClick={onPickAlbum}>Загрузить альбом (папку)</button>
            <input
              ref={inputRef}
              type="file"
              accept="audio/*"
              multiple
              style={{ display: 'none' }}
              onChange={onInputChange}
            />
            <input
              ref={albumDirInputRef}
              type="file"
              webkitdirectory="true"
              directory="true"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => {
                addAlbumFromDirectory(e.target.files);
                e.target.value = '';
              }}
            />
          </div>
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2 style={{ marginBottom: 12 }}>Загрузки</h2>
        {uploads.length === 0 ? (
          <p className="muted-text">Вы ещё не загружали треки.</p>
        ) : (
          <div className="recommendations-grid" style={{ paddingTop: 0, gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {uploads.map((u) => (
              <div key={u.id} className="recommendation-card" style={{ padding: 16, minHeight: 360 }}>
                <div className="card-image" style={{ position: 'relative', height: 200, borderRadius: 12, overflow: 'hidden' }}>
                  {u.coverUrl ? (
                    <img src={u.coverUrl} alt={u.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div className="album-art-placeholder" style={{ width: '100%', height: '100%' }}>
                      <span>{u.type?.split('/')[1]?.toUpperCase() || 'AUDIO'}</span>
                    </div>
                  )}
                  {u.status === 'processing' && (
                    <div style={{ position: 'absolute', bottom: 8, left: 8, right: 8 }}>
                      <div className="progress-bar" style={{ height: 6 }}>
                        <div className="progress-fill" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="card-content">
                  <EditableTitle value={u.name} onSave={(val) => renameTrack(u.id, val)} />
                  <div className="card-subtitle">
                    {u.status === 'processing' ? 'Обрабатывается…' : 'Опубликован'} · {formatBytes(u.size)}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, padding: '0 12px 12px' }}>
                  {u.url && (
                    <audio controls src={u.url} style={{ width: '100%' }} />
                  )}
                </div>
                <div className="card-actions" style={{ display: 'flex', gap: 8, padding: '0 12px 12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <label className="search-button" style={{ cursor: 'pointer' }}>
                    Файл обложки
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => onTrackCoverChange(u.id, e.target.files?.[0])} />
                  </label>
                  <button className="search-button" type="button" onClick={() => onTrackCoverUrl(u.id)}>URL обложки</button>
                  {u.status === 'processing' ? (
                    <button className="search-button" onClick={() => publishTrack(u.id)}>Опубликовать</button>
                  ) : (
                    <button className="search-button" disabled>Опубликован</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={{ marginTop: 24 }}>
        <h2 style={{ marginBottom: 12 }}>Альбомы</h2>
        {albums.length === 0 ? (
          <p className="muted-text">Пока нет альбомов. Загрузите папку с треками.</p>
        ) : (
          <div className="recommendations-grid" style={{ paddingTop: 0, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {albums.map((a) => {
              const tracks = uploads.filter((u) => u.albumId === a.id);
              const publishedCount = tracks.filter((t) => t.status === 'published').length;
              const total = tracks.length;
              return (
                <div key={a.id} className="recommendation-card" style={{ padding: 16, minHeight: 360 }}>
                  <div className="card-image" style={{ position: 'relative', height: 200, borderRadius: 12, overflow: 'hidden' }}>
                    {a.coverUrl ? (
                      <img src={a.coverUrl} alt={a.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div className="album-art-placeholder" style={{ width: '100%', height: '100%' }}>
                        <span>ALBUM</span>
                      </div>
                    )}
                  </div>
                  <div className="card-content">
                    <EditableTitle value={a.name} onSave={(val) => renameAlbum(a.id, val)} />
                    <div className="card-subtitle">
                      {a.status === 'processing' ? 'Обрабатывается…' : 'Опубликован'} · {publishedCount}/{total} треков
                    </div>
                  </div>
                  <div className="card-actions" style={{ display: 'flex', gap: 8, padding: '0 12px 12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <label className="search-button" style={{ cursor: 'pointer' }}>
                      Файл обложки
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => onAlbumCoverChange(a.id, e.target.files?.[0])} />
                    </label>
                    <button className="search-button" type="button" onClick={() => onAlbumCoverUrl(a.id)}>URL обложки</button>
                    <button className="search-button" onClick={() => removeAlbum(a.id)}>Удалить альбом</button>
                  </div>
                  {tracks.length > 0 && (
                    <div style={{ padding: '0 12px 12px' }}>
                      <div className="muted-text" style={{ marginBottom: 6 }}>Треки альбома:</div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
                        {tracks.slice(0, 4).map((t) => (
                          <li key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ opacity: 0.7 }}>{t.status === 'published' ? '✓' : '…'}</span>
                            <EditableTitle small value={t.name} onSave={(val) => renameTrack(t.id, val)} />
                          </li>
                        ))}
                        {tracks.length > 4 && (
                          <li className="muted-text">и ещё {tracks.length - 4}…</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section style={{ marginTop: 24 }}>
        <h2 style={{ marginBottom: 12 }}>Опубликовано</h2>
        {published.length === 0 ? (
          <p className="muted-text">Пока нет опубликованных треков.</p>
        ) : (
          <div className="results-grid">
            {published.map((u) => (
              <div key={u.id} className="recommendation-card" style={{ padding: 16 }}>
                <div className="card-content">
                  <div className="card-title" title={u.name} style={{ marginBottom: 8 }}>{u.name}</div>
                  <div className="card-subtitle" style={{ marginBottom: 8 }}>
                    Размер: {formatBytes(u.size)}
                  </div>
                  {u.url && (
                    <div style={{ marginBottom: 12 }}>
                      <audio controls src={u.url} style={{ width: '100%' }} />
                    </div>
                  )}
                  <div className="muted-text" style={{ marginBottom: 10, color: '#b3b3b3' }}>
                    Дата публикации: {formatDate(u.publishedAt)}
                  </div>
                  <div className="card-actions" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button className="search-button" onClick={() => removeItem(u.id)}>Удалить</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// Editable title inline component
function EditableTitle({ value, onSave, small }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value || '');
  useEffect(() => setVal(value || ''), [value]);
  const commit = () => {
    const trimmed = val.trim();
    onSave(trimmed || value);
    setEditing(false);
  };
  if (!editing) {
    return (
      <div className={small ? 'card-subtitle' : 'card-title'} title={value} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
        <button className="search-button" onClick={() => { setEditing(true); setVal(''); }}>Изм.</button>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <input
        className="search-input"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') setEditing(false);
        }}
        placeholder={value}
        autoFocus
        style={{ flex: 1, fontSize: small ? 14 : 16, padding: small ? '8px 10px' : '10px 12px' }}
      />
      <button className="search-button" onClick={commit}>Сохранить</button>
      <button className="search-button" onClick={() => setEditing(false)}>Отмена</button>
    </div>
  );
}
