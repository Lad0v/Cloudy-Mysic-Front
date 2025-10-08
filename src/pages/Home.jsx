import React, { useMemo, lazy, Suspense } from 'react';
import RecommendationCard from '../components/RecommendationCard';
import { playUrl, playAlbum } from '../lib/player';
import music from '../data/musicData';
import './Home.css';

// Lazy load images with fallback handling
const LazyImage = ({ src, alt, className = '' }) => {
  const [currentSrc, setCurrentSrc] = React.useState(src);
  React.useEffect(() => { setCurrentSrc(src); }, [src]);
  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (currentSrc !== '/placeholder.png') {
          setCurrentSrc('/placeholder.png');
        }
      }}
    />
  );
};

// ...existing code...

// Sample data - will be replaced with API calls later
const newReleaseOfTheWeek = {
  id: 'summer-hits-2025',
  title: 'Summer Hits 2025',
  subtitle: 'The hottest tracks of the summer',
  imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=80', // summer crowd / concert vibe
  type: 'Album',
  artist: 'Various Artists',
  audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
};

const popularTracks = [
  { id: 'p1', title: 'Blinding Lights', artist: 'The Weeknd', plays: '125M', imageUrl: 'https://images.unsplash.com/photo-1511662114068-35b22cd1a418?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 'p2', title: 'Save Your Tears', artist: 'The Weeknd', plays: '98M', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 'p3', title: 'Stay', artist: 'The Kid LAROI, Justin Bieber', plays: '87M', imageUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: 'p4', title: 'Levitating', artist: 'Dua Lipa', plays: '76M', imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  { id: 'p5', title: 'Watermelon Sugar', artist: 'Harry Styles', plays: '65M', imageUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
  { id: 'p6', title: 'Peaches', artist: 'Justin Bieber', plays: '59M', imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
  { id: 'p7', title: 'Montero', artist: 'Lil Nas X', plays: '54M', imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
  { id: 'p8', title: 'Bad Habits', artist: 'Ed Sheeran', plays: '48M', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
  { id: 'p9', title: 'Kiss Me More', artist: 'Doja Cat', plays: '44M', imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
  { id: 'p10', title: 'Heat Waves', artist: 'Glass Animals', plays: '41M', imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' },
  { id: 'p11', title: 'drivers license', artist: 'Olivia Rodrigo', plays: '39M', imageUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3' },
  { id: 'p12', title: 'Good 4 U', artist: 'Olivia Rodrigo', plays: '36M', imageUrl: 'https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3' },
];

const newReleases = [
  { id: 'n1', title: 'New Beginnings', artist: 'Artist One', date: '2025-09-15', imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
  { id: 'n2', title: 'Midnight Thoughts', artist: 'Artist Two', date: '2025-09-14', imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' },
  { id: 'n3', title: 'Summer Vibes', artist: 'Artist Three', date: '2025-09-13', imageUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3' },
  { id: 'n4', title: 'Lost in Tokyo', artist: 'DJ Sakura', date: '2025-09-12', imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3' },
  { id: 'n5', title: 'Night Drive', artist: 'Synthwave', date: '2025-09-11', imageUrl: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1000&q=80' },
  { id: 'n6', title: 'Golden Hour', artist: 'Sunset Crew', date: '2025-09-10', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80' },
  { id: 'n7', title: 'Rainy Days', artist: 'Cloudy Beats', date: '2025-09-09', imageUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1000&q=80' },
  { id: 'n8', title: 'Dreamscape', artist: 'Ambient Flow', date: '2025-09-08', imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1000&q=80' },
  { id: 'n9', title: 'Firefly', artist: 'Night Lights', date: '2025-09-07', imageUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1000&q=80' },
  { id: 'n10', title: 'Echoes', artist: 'Reverb', date: '2025-09-06', imageUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1000&q=80' },
  { id: 'n11', title: 'Sunrise', artist: 'Morning Sound', date: '2025-09-05', imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80' },
  { id: 'n12', title: 'Blue Skies', artist: 'Skyline', date: '2025-09-04', imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1000&q=80' },
];

const userMusic = [
  { id: 'u1', title: 'Morning Coffee', artist: 'User123', date: '2025-09-16', plays: '1.2K', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 'u2', title: 'Chill Lofi', artist: 'BeatsMaster', date: '2025-09-15', plays: '5.7K', imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 'u3', title: 'Guitar Session', artist: 'MusicLover', date: '2025-09-14', plays: '3.4K', imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: 'u4', title: 'Sunset Walk', artist: 'Dreamer', date: '2025-09-13', plays: '2.8K', imageUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  { id: 'u5', title: 'Rainy Mood', artist: 'Cloudy Beats', date: '2025-09-12', plays: '2.5K', imageUrl: 'https://images.unsplash.com/photo-1465101178521-c1a6bca7a581?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
  { id: 'u6', title: 'City Lights', artist: 'UrbanSoul', date: '2025-09-11', plays: '2.2K', imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
  { id: 'u7', title: 'Forest Echo', artist: 'NatureSound', date: '2025-09-10', plays: '2.0K', imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
  { id: 'u8', title: 'Ocean Drive', artist: 'WaveRider', date: '2025-09-09', plays: '1.8K', imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
  { id: 'u9', title: 'Starry Night', artist: 'Cosmo', date: '2025-09-08', plays: '1.6K', imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
  { id: 'u10', title: 'Mountain Air', artist: 'Highlander', date: '2025-09-07', plays: '1.4K', imageUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' },
  { id: 'u11', title: 'Golden Fields', artist: 'Sunset Crew', date: '2025-09-06', plays: '1.2K', imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3' },
  { id: 'u12', title: 'Dreamcatcher', artist: 'Ambient Flow', date: '2025-09-05', plays: '1.0K', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3' },
];

const recommendations = [
  {
    id: 1,
    title: 'Ariana Grande',
    subtitle: 'Ariana Grande',
    // Pop diva / stage lighting
    imageUrl: 'https://images.unsplash.com/photo-1518976024611-4881d58c1c91?auto=format&fit=crop&w=1000&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 2,
    title: 'TOP 100 Hits',
    subtitle: 'Alejano',
    // Crowd / festival energy
    imageUrl: 'https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=1000&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 3,
    title: 'Urban Mix',
    subtitle: 'Carrie Underwood',
    // City night / urban vibe
    imageUrl: 'https://images.unsplash.com/photo-1494783367193-149034c05e8f?auto=format&fit=crop&w=1000&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
  {
    id: 4,
    title: 'Lo-Fi Chill',
    subtitle: 'Beats & Coffee',
    // Cozy desk / chill work ambience
    imageUrl: 'https://images.unsplash.com/photo-1490135900376-2e86d918a23d?auto=format&fit=crop&w=1000&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  },
  {
    id: 5,
    title: 'Electro House',
    subtitle: 'DJ Pulse',
    // Neon lights / DJ deck
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
  },
  {
    id: 6,
    title: 'Indie Folk',
    subtitle: 'The Wanderers',
    // Acoustic guitar / nature
    imageUrl: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1000&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
  },
  {
    id: 7,
    title: 'Chillhop',
    subtitle: 'Beatsmith',
    // Vinyl / warm tones
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3'
  },
  {
    id: 8,
    title: 'Ambient Waves',
    subtitle: 'Sleep Sound',
    // Abstract calm gradient water
    imageUrl: 'https://images.unsplash.com/photo-1501973801540-537f08ccae7b?auto=format&fit=crop&w=1000&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
  },
  {
    id: 9,
    title: 'Rock Anthems',
    subtitle: 'Stadium',
    // Guitar performance / stage
    imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1000&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3'
  },
  {
    id: 10,
    title: 'Classical Calm',
    subtitle: 'Orchestra',
    // Piano / classical instrument
    imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1000&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3'
  },
  {
    id: 11,
    title: 'Bedroom Pop',
    subtitle: 'Soft Echo',
    // Soft pastel cozy room
    imageUrl: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1000&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3'
  },
  {
    id: 12,
    title: 'Global Beats',
    subtitle: 'WorldMix',
    // Cultural / world percussion vibe
    imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=1000&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3'
  },
];

const Home = () => {
  // Horizontal scroller component used for each section
  const HorizontalScroller = ({ children, id }) => {
    const containerRef = React.useRef(null);
    const leftRef = React.useRef(null);
    const rightRef = React.useRef(null);

    const scrollBy = (dir = 1) => {
      const el = containerRef.current;
      if (!el) return;
      const scrollAmount = Math.round(el.clientWidth * 0.9); // scroll by ~90% of visible width
      // use scrollBy to avoid lint issues with logical properties
      el.scrollBy(dir * scrollAmount, 0);
    };

    // update arrow visibility based on scroll position
    const updateArrows = () => {
      const el = containerRef.current;
      if (!el) return;
      const left = leftRef.current;
      const right = rightRef.current;
      const atStart = el.scrollLeft <= 5;
      const atEnd = el.scrollWidth - el.clientWidth - el.scrollLeft <= 5;
      // Use opacity to avoid layout shifts; pointer-events to disable interaction
      if (left) {
        left.style.opacity = atStart ? '0' : '1';
        left.style.pointerEvents = atStart ? 'none' : 'auto';
      }
      if (right) {
        right.style.opacity = atEnd ? '0' : '1';
        right.style.pointerEvents = atEnd ? 'none' : 'auto';
      }
    };

    React.useEffect(() => {
      const el = containerRef.current;
      if (!el) return;
      updateArrows();
      el.addEventListener('scroll', updateArrows, { passive: true });
      window.addEventListener('resize', updateArrows);
      return () => {
        el.removeEventListener('scroll', updateArrows);
        window.removeEventListener('resize', updateArrows);
      };
    }, []);
    return (
      <div className="horizontal-section">
        <button ref={leftRef} className="scroll-btn left" aria-label="Scroll left" onClick={() => scrollBy(-1)}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden style={{filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.65))'}}>
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="#ffffff" />
          </svg>
        </button>
        <div ref={containerRef} id={id} className="horizontal-scroll">{children}</div>
        <button ref={rightRef} className="scroll-btn right" aria-label="Scroll right" onClick={() => scrollBy(1)}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden style={{filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.65))'}}>
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" fill="#ffffff" />
          </svg>
        </button>
      </div>
    );
  };
  // Memoize the track lists to prevent unnecessary re-renders
  const popularTracksList = useMemo(() => (
    popularTracks.map(track => (
      <RecommendationCard
        key={track.id}
        title={track.title}
        subtitle={track.artist + (track.plays ? ` · ${track.plays} plays` : '')}
        imageUrl={track.imageUrl}
        audioUrl={track.audioUrl}
      />
    ))
  ), []);

  const newReleasesList = useMemo(() => (
    newReleases.map(release => (
      <RecommendationCard
        key={release.id}
        title={release.title}
        subtitle={release.artist + (release.date ? ` · ${release.date}` : '')}
        imageUrl={release.imageUrl}
        audioUrl={release.audioUrl}
      />
    ))
  ), []);

  const userMusicList = useMemo(() => (
    userMusic.map(track => (
      <RecommendationCard
        key={track.id}
        title={track.title}
        subtitle={track.artist + (track.plays ? ` · ${track.plays} plays` : '') + (track.date ? ` · ${track.date}` : '')}
        imageUrl={track.imageUrl}
        audioUrl={track.audioUrl}
      />
    ))
  ), []);

  const recommendationsList = useMemo(() => (
    recommendations.map(rec => {
      const clickable = rec.title === 'TOP 100 Hits' || rec.title === 'Lo-Fi Chill';
      const handleClick = clickable
        ? () => {
            if (rec.title === 'TOP 100 Hits') window.location.hash = '#/album/top-100-hits';
            if (rec.title === 'Lo-Fi Chill') window.location.hash = '#/album/lo-fi-chill';
          }
        : undefined;
      return (
        <RecommendationCard
          key={rec.id}
          title={rec.title}
          subtitle={rec.subtitle}
          imageUrl={rec.imageUrl}
          audioUrl={rec.audioUrl}
          onClick={handleClick}
        />
      );
    })
  ), []);

  return (
    <div className="home">
      {/* New Release of the Week Banner */}
      <section
        className="banner"
        role="group"
        aria-label={`New Release: ${newReleaseOfTheWeek.title}`}
        onClick={() => { window.location.hash = `#/album/${newReleaseOfTheWeek.id}`; }}
        tabIndex={0}
        onKeyDown={(e)=>{ if(e.key==='Enter' || e.key===' '){ window.location.hash = `#/album/${newReleaseOfTheWeek.id}`; } }}
        style={{cursor:'pointer'}}
      >
        <div className="banner-content">
          <span className="banner-tag">New Release</span>
          <h2>{newReleaseOfTheWeek.title}</h2>
          <p className="banner-subtitle">{newReleaseOfTheWeek.subtitle}</p>
          <div style={{display:'flex', gap:12, flexWrap:'wrap'}}>
            <button
              className="play-button"
              onClick={(e) => { 
                e.stopPropagation(); 
                // Attempt to find full album in data for queue play
                try {
                  const alb = music.albumData?.[newReleaseOfTheWeek.id];
                  if (alb) {
                    playAlbum(alb, 0);
                  } else if (newReleaseOfTheWeek.audioUrl) {
                    playUrl(newReleaseOfTheWeek.audioUrl, { id: newReleaseOfTheWeek.id, title: newReleaseOfTheWeek.title, artist: newReleaseOfTheWeek.artist, imageUrl: newReleaseOfTheWeek.imageUrl });
                  }
                } catch { /* fallback ignored */ }
              }}
            >Play</button>
            <button
              className="play-button ghost"
              style={{background:'rgba(255,255,255,0.18)'}}
              onClick={(e) => { e.stopPropagation(); window.location.hash = `#/album/${newReleaseOfTheWeek.id}`; }}
            >Open Album</button>
          </div>
        </div>
        <div className="banner-image" aria-hidden="true">
          <LazyImage
            src={newReleaseOfTheWeek.imageUrl}
            alt={newReleaseOfTheWeek.title}
          />
        </div>
      </section>


      {/* Recommendations Section */}
      <section className="section">
        <h2 className="section-title">Recommendations</h2>
        <HorizontalScroller id="recommendations-scroll">
          {recommendationsList.map((rec, idx) => (
            React.cloneElement(rec, { key: rec.key || idx })
          ))}
        </HorizontalScroller>
      </section>

      {/* Popular Now Section */}
      <section className="section">
        <h2 className="section-title">Popular Now</h2>
        <HorizontalScroller id="popular-scroll">
          {popularTracksList}
        </HorizontalScroller>
      </section>

      {/* Split Dual Theme Banner (moved after Popular Now, images updated) */}
      <section className="split-banner" aria-label="Featured themes">
        <div
          className="split-panel left"
          role="group"
          aria-label="Lo-Fi Chill"
          onClick={()=>{ window.location.hash = '#/album/lo-fi-chill'; }}
          tabIndex={0}
          onKeyDown={(e)=>{ if(e.key==='Enter' || e.key===' '){ window.location.hash = '#/album/lo-fi-chill'; } }}
        >
          <div className="panel-overlay" />
          <div className="panel-content">
            <span className="panel-tag">Chill Mood</span>
            <h3 className="panel-title">Lo‑Fi Chill</h3>
            <p className="panel-subtitle">Beats & Coffee · Focus · Relax · Night coding</p>
            <div className="panel-actions">
              <button
                className="play-button small"
                onClick={(e) => {
                  e.stopPropagation();
                  try {
                    const alb = music.albumData?.['lo-fi-chill'];
                    if (alb) {
                      playAlbum(alb, 0);
                    } else window.location.hash = '#/album/lo-fi-chill';
                  } catch { window.location.hash = '#/album/lo-fi-chill'; }
                }}
              >Play</button>
              <button className="play-button ghost" onClick={(e) => { e.stopPropagation(); window.location.hash = '#/album/lo-fi-chill'; }}>Album</button>
            </div>
          </div>
          <LazyImage
            className="panel-bg"
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=80" /* cozy cafe / work */
            alt="Lo-Fi Chill background"
          />
        </div>
        <div
          className="split-panel right"
          role="group"
          aria-label="Top 100 Hits"
          onClick={()=>{ window.location.hash = '#/album/top-100-hits'; }}
          tabIndex={0}
          onKeyDown={(e)=>{ if(e.key==='Enter' || e.key===' '){ window.location.hash = '#/album/top-100-hits'; } }}
        >
          <div className="panel-overlay" />
            <div className="panel-content">
              <span className="panel-tag alt">Top Charts</span>
              <h3 className="panel-title">Top 100 Hits</h3>
              <p className="panel-subtitle">Alejano · Energy · Trending · Daily mix</p>
              <div className="panel-actions">
                <button
                  className="play-button small"
                  onClick={(e) => {
                    e.stopPropagation();
                    try {
                      const alb = music.albumData?.['top-100-hits'];
                      if (alb) {
                        playAlbum(alb, 0);
                      } else window.location.hash = '#/album/top-100-hits';
                    } catch { window.location.hash = '#/album/top-100-hits'; }
                  }}
                >Play</button>
                <button className="play-button ghost" onClick={(e) => { e.stopPropagation(); window.location.hash = '#/album/top-100-hits'; }}>Album</button>
              </div>
            </div>
            <LazyImage
              className="panel-bg"
              src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80" /* vibrant stage lighting */
              alt="Top 100 background"
            />
        </div>
      </section>

      {/* New Releases Section */}
      <section className="section">
        <h2 className="section-title">New Releases</h2>
        <HorizontalScroller id="newreleases-scroll">
          {newReleasesList}
        </HorizontalScroller>
      </section>

      {/* User Music Section */}
      <section className="section">
        <h2 className="section-title">From Our Community</h2>
        <HorizontalScroller id="usermusic-scroll">
          {userMusicList}
        </HorizontalScroller>
      </section>
    </div>
  );
};

export default Home;
