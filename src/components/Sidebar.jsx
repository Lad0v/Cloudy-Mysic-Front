import React, { useEffect, useState } from 'react';
import { FaHome, FaSearch, FaMusic, FaList, FaUser } from 'react-icons/fa';
import { FaCloud } from 'react-icons/fa6';

const Sidebar = () => {
  const [route, setRoute] = useState(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    return hash.replace('#', '') || '/';
  });

  useEffect(() => {
    const onHashChange = () => {
      const newHash = window.location.hash.replace('#', '') || '/';
      setRoute(newHash);
    };
    window.addEventListener('hashchange', onHashChange);
    onHashChange();
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return (
    <div className="sidebar">
      <div className="logo">
        <FaCloud className="logo-icon" />
        <span>Cloudy</span>
      </div>
      <nav className="nav-menu">
        <a href="#/" className={`nav-link ${route === '/' ? 'active' : ''}`}>
          <FaHome className="nav-icon" />
          <span>Домой</span>
        </a>
        <a href="#/search" className={`nav-link ${route === '/search' ? 'active' : ''}`}>
          <FaSearch className="nav-icon" />
          <span>Поиск</span>
        </a>
        <a href="#/my-music" className={`nav-link ${route === '/my-music' ? 'active' : ''}`}>
          <FaMusic className="nav-icon" />
          <span>Моя музыка</span>
        </a>
        <a href="#/playlists" className={`nav-link ${route === '/playlists' ? 'active' : ''}`}>
          <FaList className="nav-icon" />
          <span>Плейлисты</span>
        </a>
      </nav>
      <div className="profile-section">
        <a href="#/profile" className={`nav-link ${route === '/profile' ? 'active' : ''}`}>
          <FaUser className="nav-icon" />
          <span>Профиль</span>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
