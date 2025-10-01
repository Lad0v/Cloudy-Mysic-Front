import React, { useEffect, useMemo, useRef, useState } from 'react';

const PROFILE_KEY = 'cloudy_profile';

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

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

function formatDate(ts) {
  try { return new Date(ts).toLocaleDateString(); } catch { return ''; }
}

async function fileToDataURL(file) {
  if (!file) return '';
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Profile() {
  const [profile, setProfile] = useState(() => {
    const existing = readJSON(PROFILE_KEY, null);
    if (existing) return existing;
    const stub = {
      nickname: 'User',
      email: '',
      bio: '',
      avatarDataUrl: '',
      registeredAt: Date.now(),
    };
    writeJSON(PROFILE_KEY, stub);
    return stub;
  });
  const [editingNick, setEditingNick] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [nickValue, setNickValue] = useState(profile.nickname || '');
  const [bioValue, setBioValue] = useState(profile.bio || '');
  const fileInputRef = useRef(null);

  useEffect(() => {
    writeJSON(PROFILE_KEY, profile);
  }, [profile]);

  const stats = useMemo(() => {
    const playlists = readList('cloudy_playlists', []);
    const uploads = readList('cloudy_uploads', []);
    const favorites = readList('cloudy_liked_tracks', []);
    const followingList = readList('cloudy_following', []);
    const followersList = readList('cloudy_followers', []);
    const publishedCount = uploads.filter((u) => u.status === 'published').length;
    return {
      playlists: playlists.length,
      uploads: uploads.length,
      published: publishedCount,
      favorites: favorites.length,
      following: Array.isArray(followingList) ? followingList.length : 0,
      followers: Array.isArray(followersList) ? followersList.length : 0,
    };
  }, [profile]);

  const changeAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataURL(file);
    setProfile((p) => ({ ...p, avatarDataUrl: dataUrl }));
    // reset input to allow same file selection again
    e.target.value = '';
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    window.location.hash = '#/profile';
    // мгновенное обновление состояния приложения
    setTimeout(() => window.location.reload(), 0);
  };

  const goMyMusic = () => (window.location.hash = '#/my-music');
  const goPlaylists = () => (window.location.hash = '#/playlists');

  return (
    <div className="profile-page" style={{ display: 'grid', placeItems: 'start', gap: 24 }}>
      <div className="profile-card" style={{ background: 'rgba(255,255,255,0.85)', borderRadius: 16, padding: 28, maxWidth: 1200, width: '100%' }}>
        <h1 className="profile-title" style={{ marginBottom: 20 }}>Профиль</h1>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ width: 140, height: 140, borderRadius: '50%', overflow: 'hidden', background: 'rgba(0,0,0,0.1)' }}>
            {profile.avatarDataUrl ? (
              <img src={profile.avatarDataUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: '#666' }}>No avatar</div>
            )}
          </div>
          <div style={{ display: 'grid', gap: 10, flex: 1, minWidth: 280 }}>
            {/* Nickname editable */}
            {!editingNick ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="card-title" style={{ margin: 0 }}>{profile.nickname || 'Без имени'}</div>
                <button className="search-button" onClick={() => { setEditingNick(true); setNickValue(profile.nickname || ''); }}>Изм.</button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input className="search-input" value={nickValue} onChange={(e) => setNickValue(e.target.value)} placeholder="Никнейм" autoFocus />
                <button className="search-button" onClick={() => { setProfile((p) => ({ ...p, nickname: nickValue.trim() || p.nickname })); setEditingNick(false); }}>Сохранить</button>
                <button className="search-button" onClick={() => setEditingNick(false)}>Отмена</button>
              </div>
            )}

            {/* Bio editable */}
            {!editingBio ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="card-subtitle" style={{ margin: 0 }}>{profile.bio || 'Добавьте описание профиля'}</div>
                <button className="search-button" onClick={() => { setEditingBio(true); setBioValue(profile.bio || ''); }}>Изм.</button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                <input className="search-input" value={bioValue} onChange={(e) => setBioValue(e.target.value)} placeholder="О себе" style={{ flex: 1 }} />
                <button className="search-button" onClick={() => { setProfile((p) => ({ ...p, bio: bioValue.trim() })); setEditingBio(false); }}>Сохранить</button>
                <button className="search-button" onClick={() => setEditingBio(false)}>Отмена</button>
              </div>
            )}

            <div className="muted-text" style={{ color: '#9e9e9e' }}>Дата регистрации: {formatDate(profile.registeredAt)}</div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
              <label className="search-button" style={{ cursor: 'pointer' }}>
                Сменить аватар
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={changeAvatar} />
              </label>
              <button className="search-button" onClick={goMyMusic}>Моя музыка</button>
              <button className="search-button" onClick={goPlaylists}>Плейлисты</button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div className="recommendation-card" style={{ padding: 12 }}>
            <div className="card-title" style={{ marginBottom: 4 }}>Плейлисты</div>
            <div className="card-subtitle">{stats.playlists}</div>
          </div>
          <div className="recommendation-card" style={{ padding: 12 }}>
            <div className="card-title" style={{ marginBottom: 4 }}>Загрузки</div>
            <div className="card-subtitle">{stats.uploads}</div>
          </div>
          <div className="recommendation-card" style={{ padding: 12 }}>
            <div className="card-title" style={{ marginBottom: 4 }}>Опубликовано</div>
            <div className="card-subtitle">{stats.published}</div>
          </div>
          <div className="recommendation-card" style={{ padding: 12 }}>
            <div className="card-title" style={{ marginBottom: 4 }}>Избранное</div>
            <div className="card-subtitle">{stats.favorites}</div>
          </div>
          <div className="recommendation-card" style={{ padding: 12 }}>
            <div className="card-title" style={{ marginBottom: 4 }}>Подписки</div>
            <div className="card-subtitle">{stats.following}</div>
          </div>
          <div className="recommendation-card" style={{ padding: 12 }}>
            <div className="card-title" style={{ marginBottom: 4 }}>Подписчики</div>
            <div className="card-subtitle">{stats.followers}</div>
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
          <button className="auth-button" onClick={logout}>Выйти</button>
        </div>
      </div>
    </div>
  );
}
