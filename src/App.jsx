import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import PlayerBar from './components/PlayerBar';
import Search from './pages/Search';
import AlbumMusic from './pages/AlbumMusic';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Playlists from './pages/Playlists';
import PlaylistCreate from './pages/PlaylistCreate';
import MyMusic from './pages/MyMusic';
import PlaylistView from './pages/PlaylistView';
import Home from './pages/Home';
import './App.css';

function App() {
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
    // In case initial load has a hash
    onHashChange();
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const renderRoute = () => {
    // album routes
    if (route.startsWith('/album/')) return <AlbumMusic />;
    // playlist routes
    if (route.startsWith('/playlist/')) return <PlaylistView />;
    switch (route) {
      case '/search':
        return <Search />;
      case '/my-music':
        return <MyMusic />;
      case '/profile': {
        const isLoggedIn = !!localStorage.getItem('auth_token');
        return isLoggedIn ? <Profile /> : <Auth />;
      }
      case '/playlists':
        return <Playlists />;
      case '/playlists/create':
        return <PlaylistCreate />;
      case '/':
      default:
        return <Home />;
    }
  };

  return (
    <div className="app">
      <Sidebar />
      <main className="main-content">
        <div className="main-scroll">
          {renderRoute()}
        </div>
      </main>
      <PlayerBar />
    </div>
  );
}

export default App
