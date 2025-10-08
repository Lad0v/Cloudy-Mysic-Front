import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import music from './data/musicData';

// Populate a global cache of albums for lightweight access (legacy components relying on window.__cloudyAlbums)
try {
  if (typeof window !== 'undefined') {
    if (!window.__cloudyAlbums) {
      window.__cloudyAlbums = music.albumData || {};
    }
  }
} catch { /* ignore */ }

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
