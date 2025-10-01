import React, { useMemo, useState } from 'react';

export default function Auth({ onSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({
    name: '',
    login: '',
    password: '',
    repeatPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isRegister = mode === 'register';

  const canSubmit = useMemo(() => {
    if (isRegister) {
      return (
        form.name.trim().length >= 2 &&
        form.login.trim().length >= 3 &&
        form.password.length >= 6 &&
        form.password === form.repeatPassword
      );
    }
    return form.login.trim().length >= 3 && form.password.length >= 6;
  }, [form, isRegister]);

  const submit = async (e) => {
    e.preventDefault();
    const isAdminCase = !isRegister && form.login.trim() === 'Admin' && form.password === 'Admin';
    if (loading) return;
    if (!isAdminCase && !canSubmit) return;
    setLoading(true);
    setError('');
    try {
      // Special-case: allow Admin/Admin login with prefilled profile
      if (isAdminCase) {
        // Write an Admin profile stub if not present
        const PROFILE_KEY = 'cloudy_profile';
        try {
          const existing = JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null');
          if (!existing || (existing && existing.nickname !== 'Admin')) {
            const adminProfile = {
              nickname: 'Admin',
              email: 'admin@example.com',
              bio: 'Администратор аккаунт',
              avatarDataUrl: '',
              registeredAt: Date.now(),
            };
            localStorage.setItem(PROFILE_KEY, JSON.stringify(adminProfile));
          }
        } catch {}
        localStorage.setItem('auth_token', 'admin_token');
        onSuccess?.();
        window.location.hash = '#/profile';
        // Force refresh to ensure the app reflects the new auth state immediately
        setTimeout(() => window.location.reload(), 0);
        return;
      }

      // Default stub flow (login or register)
      await new Promise((r) => setTimeout(r, 700));
      localStorage.setItem('auth_token', 'stub_token');
      onSuccess?.();
      window.location.hash = '#/profile';
      setTimeout(() => window.location.reload(), 0);
    } catch (err) {
      setError('Ошибка. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-tabs" role="tablist">
        <button
          className={`auth-tab ${!isRegister ? 'active' : ''}`}
          onClick={() => setMode('login')}
          role="tab"
          aria-selected={!isRegister}
        >
          Login
        </button>
        <button
          className={`auth-tab ${isRegister ? 'active' : ''}`}
          onClick={() => setMode('register')}
          role="tab"
          aria-selected={isRegister}
        >
          Register
        </button>
      </div>

      <div className={`auth-card mode-${mode}`}>
        <form className={`auth-form ${isRegister ? 'register' : 'login'}`} onSubmit={submit}>
          {/* Register-only field with smooth reveal */}
          <div className={`auth-field reg-only ${isRegister ? 'show' : 'hide'}`}>
            <label className="auth-label">Name</label>
            <input
              className="auth-input"
              type="text"
              placeholder="username"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Login</label>
            <input
              className="auth-input"
              type="text"
              placeholder="login or email"
              value={form.login}
              onChange={(e) => setForm({ ...form, login: e.target.value })}
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input
              className="auth-input"
              type="password"
              placeholder="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {/* Register-only field with smooth reveal */}
          <div className={`auth-field reg-only ${isRegister ? 'show' : 'hide'}`}>
            <label className="auth-label">Repeat Password</label>
            <input
              className="auth-input"
              type="password"
              placeholder="password"
              value={form.repeatPassword}
              onChange={(e) => setForm({ ...form, repeatPassword: e.target.value })}
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button
            className="auth-button"
            type="submit"
            disabled={(!canSubmit && !(mode === 'login' && form.login.trim() === 'Admin' && form.password === 'Admin')) || loading}
          >
            {loading ? '...' : isRegister ? 'Register' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
