import React, { useEffect, useMemo, useRef, useState } from 'react';
import './Profile.css';

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
    const stub = { nickname: 'User123', email: 'user123@example.com', bio: '', avatarDataUrl: '', registeredAt: Date.now(), settings: { darkMode: false, notifications: true } };
    writeJSON(PROFILE_KEY, stub);
    return stub;
  });
  const [editingBio, setEditingBio] = useState(false);
  const [bioValue, setBioValue] = useState(profile.bio || '');
  const [editingNick, setEditingNick] = useState(false);
  const [nickValue, setNickValue] = useState(profile.nickname || '');
  const fileInputRef = useRef(null);

  // Settings toggles
  const settings = profile.settings || { darkMode: false, notifications: true };

  useEffect(() => { writeJSON(PROFILE_KEY, profile); }, [profile]);

  const stats = useMemo(() => {
    const playlists = readList('cloudy_playlists', []);
    const uploads = readList('cloudy_uploads', []);
    const publishedCount = uploads.filter(u => u.status === 'published').length;
    return { playlists: playlists.length, uploads: uploads.length, published: publishedCount, followers: 0, following: 0 };
  }, [profile]);

  const changeAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataURL(file);
    setProfile(p => ({ ...p, avatarDataUrl: dataUrl }));
    e.target.value = '';
  };

  const toggleSetting = (key) => {
    setProfile(p => ({ ...p, settings: { ...p.settings, [key]: !p.settings?.[key] } }));
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    window.location.hash = '#/profile';
    setTimeout(() => window.location.reload(), 0);
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-card-outer">
        <div className="profile-left">
          <h2 className="profile-heading">Профиль</h2>
          <div className="profile-avatar-block">
            <div className="avatar-circle">
              {profile.avatarDataUrl ? (
                <img src={profile.avatarDataUrl} alt="avatar" />
              ) : (
                <div className="avatar-placeholder">No avatar</div>
              )}
            </div>
            <div className="profile-main-info">
              {!editingNick ? (
                <div className="nick-row">
                  <h2 className="nick">{profile.nickname || 'User'}</h2>
                  <button className="btn small" onClick={() => { setEditingNick(true); setNickValue(profile.nickname || ''); }}>Изм.</button>
                </div>
              ) : (
                <div className="edit-row">
                  <input className="input" value={nickValue} onChange={(e)=>setNickValue(e.target.value)} autoFocus placeholder="Ник" />
                  <button className="btn small" onClick={()=>{ setProfile(p=>({...p,nickname:nickValue.trim()||p.nickname})); setEditingNick(false); }}>OK</button>
                  <button className="btn ghost small" onClick={()=>setEditingNick(false)}>✕</button>
                </div>
              )}
              {!editingBio ? (
                <div className="bio-row">
                  <p className="bio-text">{profile.bio || 'Добавьте описание профиля'}</p>
                  <button className="btn tiny ghost" onClick={() => { setEditingBio(true); setBioValue(profile.bio || ''); }}>Изм.</button>
                </div>
              ) : (
                <div className="edit-row">
                  <input className="input" value={bioValue} onChange={(e)=>setBioValue(e.target.value)} placeholder="О себе" />
                  <button className="btn small" onClick={()=>{ setProfile(p=>({...p,bio:bioValue.trim()})); setEditingBio(false); }}>OK</button>
                  <button className="btn ghost small" onClick={()=>setEditingBio(false)}>✕</button>
                </div>
              )}
              <div className="quick-buttons">
                <label className="btn" style={{cursor:'pointer'}}>
                  Сменить аватар
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={changeAvatar} style={{display:'none'}} />
                </label>
                <button className="btn" onClick={()=> window.location.hash = '#/my-music'}>Моя музыка</button>
                <button className="btn" onClick={()=> window.location.hash = '#/playlists'}>Плейлисты</button>
              </div>
            </div>
          </div>
          <div className="stats-grid">
            <div className="stat-card"><span className="stat-label">Плейлисты</span><span className="stat-value">{stats.playlists}</span></div>
            <div className="stat-card"><span className="stat-label">Загрузки</span><span className="stat-value">{stats.uploads}</span></div>
            <div className="stat-card"><span className="stat-label">Опубликовано</span><span className="stat-value">{stats.published}</span></div>
            <div className="stat-card"><span className="stat-label">Подписчики</span><span className="stat-value">{stats.followers}</span></div>
            <div className="stat-card"><span className="stat-label">Подписки</span><span className="stat-value">{stats.following}</span></div>
          </div>
          <button className="btn primary wide" onClick={logout}>Выйти</button>
        </div>
        <div className="profile-right">
          <h2 className="settings-heading">Настройки</h2>
          <div className="settings-list">
            <div className="settings-item">
              <span className="icon">🔒</span>
              <span className="si-label">Сменить пароль</span>
              <button className="btn tiny ghost" disabled>...</button>
            </div>
            <div className="settings-item">
              <span className="icon">🌐</span>
              <span className="si-label">Язык интерфейса</span>
              <button className="btn tiny ghost" disabled>RU</button>
            </div>
            <div className="settings-item toggle" onClick={()=>toggleSetting('darkMode')} role="button" tabIndex={0}>
              <span className="icon">🌙</span>
              <span className="si-label">Тема</span>
              <div className={'switch'+(settings.darkMode?' on':'')}><div className="knob" /></div>
            </div>
            <div className="settings-item toggle" onClick={()=>toggleSetting('notifications')} role="button" tabIndex={0}>
              <span className="icon">🔔</span>
              <span className="si-label">Уведомления</span>
              <div className={'switch'+(settings.notifications?' on':'')}><div className="knob" /></div>
            </div>
            <div className="settings-item danger" onClick={()=> alert('Удаление аккаунта (заглушка)')} role="button" tabIndex={0}>
              <span className="icon">🗑️</span>
              <span className="si-label">Удалить аккаунт</span>
            </div>
          </div>
          {/* Back button removed per request */}
        </div>
      </div>
    </div>
  );
}
