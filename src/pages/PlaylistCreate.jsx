import React, { useMemo, useRef, useState } from 'react';

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

function savePlaylists(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export default function PlaylistCreate() {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [filePreview, setFilePreview] = useState('');
  const fileInputRef = useRef(null);

  const onPickFile = () => fileInputRef.current?.click();

  const fileToDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const onLocalFile = async (e) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      setError('Нужен файл изображения');
      return;
    }
    if (f.size > 3 * 1024 * 1024) { // 3MB лимит
      setError('Файл слишком большой (>3MB)');
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(f);
      setImageUrl(dataUrl);
      setFilePreview(dataUrl);
      setError('');
    } catch {
      setError('Не удалось прочитать файл');
    }
  };

  const clearImage = () => {
    setImageUrl('');
    setFilePreview('');
  };

  const canSave = useMemo(() => name.trim().length >= 2, [name]);

  const onSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!canSave) return;

    const items = loadPlaylists();
    const exists = items.some(
      (p) => p.name.trim().toLowerCase() === name.trim().toLowerCase()
    );
    if (exists) {
      setError('Плейлист с таким названием уже существует');
      return;
    }

    const id = 'pl_' + Math.random().toString(36).slice(2, 9);
    const newItem = {
      id,
      name: name.trim(),
      createdAt: Date.now(),
      imageUrl: imageUrl.trim() || 'https://via.placeholder.com/300x300?text=Playlist',
    };
    savePlaylists([newItem, ...items]);
    window.location.hash = '#/playlists';
  };

  const cancel = () => {
    window.location.hash = '#/playlists';
  };

  return (
    <div className="playlist-create-page">
      <div className="auth-card">
        <form className="auth-form" onSubmit={onSubmit}>
          <div className="auth-field">
            <label className="auth-label">Название плейлиста</label>
            <input
              className="auth-input"
              type="text"
              placeholder="Например: Дорога, Тренировка"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Фото (URL или локальный файл)</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input
                className="auth-input"
                type="text"
                placeholder="https://... (можно оставить пустым)"
                value={imageUrl.startsWith('data:') ? '' : imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                disabled={Boolean(imageUrl && imageUrl.startsWith('data:'))}
              />
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button type="button" className="auth-button" style={{ flex: '0 0 auto', background: 'rgba(108,92,231,0.4)' }} onClick={onPickFile}>Выбрать файл</button>
                <button type="button" className="auth-button" style={{ flex: '0 0 auto', background: 'rgba(255,118,117,0.4)' }} onClick={clearImage} disabled={!imageUrl}>Очистить</button>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onLocalFile} />
              { (imageUrl || filePreview) && (
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 96, height: 96, borderRadius: 8, overflow: 'hidden', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    { (filePreview || (imageUrl && imageUrl.startsWith('data:'))) ? (
                      <img src={filePreview || imageUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : imageUrl ? (
                      <img src={imageUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.opacity = 0.3; }} />
                    ) : null }
                  </div>
                  <div className="muted-text" style={{ fontSize: 12, maxWidth: 240 }}>
                    Можно вставить ссылку или выбрать файл. При выборе файла он сохраняется как dataURL в localStorage.
                  </div>
                </div>
              ) }
            </div>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="button" className="auth-button" onClick={cancel} style={{ background: 'rgba(108,92,231,0.5)' }}>
              Отмена
            </button>
            <button type="submit" className="auth-button" disabled={!canSave}>
              Создать плейлист
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
