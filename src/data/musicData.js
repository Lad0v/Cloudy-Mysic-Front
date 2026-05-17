const albumData = {
  'summer-hits-2025': {
    id: 'summer-hits-2025',
    title: 'Summer Hits 2025',
    artist: 'Various Artists',
    imageUrl: '/images/concert-crowd-summer.jpg',
    tracks: [
      { id: 's1', title: 'Sunrise Anthem', artist: 'DJ Horizon', duration: '3:28', imageUrl: '/images/sunset-beach.jpg', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
      { id: 's2', title: 'Heatwave Drive', artist: 'Glass Runner', duration: '4:05', imageUrl: '/images/neon-reflection.jpg', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
      { id: 's3', title: 'Golden Sand', artist: 'Sunset Crew', duration: '3:46', imageUrl: '/images/golden-beach.jpg', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' }
    ]
  },
  'top-100-hits': {
    id: 'top-100-hits',
    title: 'Top 100 Hits',
    artist: 'Alejano',
    // Unified with Home recommendations (festival / crowd energy)
    imageUrl: '/images/concert-stage-crowd.jpg',
    tracks: [
      { id: 'p1', title: 'Blinding Lights', artist: 'The Weeknd', duration: '3:20', imageUrl: '/images/neon-alley.jpg', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
      { id: 'p2', title: 'Save Your Tears', artist: 'The Weeknd', duration: '3:11', imageUrl: '/images/rainy-neon-street.jpg', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
      { id: 'p3', title: 'Stay', artist: 'The Kid LAROI, Justin Bieber', duration: '2:21', imageUrl: '/images/forest-green.jpg', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
      { id: 'p4', title: 'Levitating', artist: 'Dua Lipa', duration: '3:23', imageUrl: '/images/concert-stage-smoke.jpg', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
      { id: 'p5', title: 'Watermelon Sugar', artist: 'Harry Styles', duration: '2:54', imageUrl: '/images/golden-beach.jpg', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
      { id: 'p6', title: 'Peaches', artist: 'Justin Bieber', duration: '3:18', imageUrl: '/images/sunset-beach.jpg', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
      { id: 'p7', title: 'Montero', artist: 'Lil Nas X', duration: '2:17', imageUrl: '/images/rainy-neon-street.jpg', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
      { id: 'p8', title: 'Bad Habits', artist: 'Ed Sheeran', duration: '3:51', imageUrl: '/images/neon-alley.jpg', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' }
    ]
  },
  'lo-fi-chill': {
    id: 'lo-fi-chill',
    title: 'Lo-Fi Chill',
    artist: 'Beats & Coffee',
    // Unified with Home recommendations (cozy desk / chill ambience)
    imageUrl: '/images/coffee-shop.jpg',
    tracks: [
      { id: 'n1', title: 'New Beginnings', artist: 'Artist One', duration: '3:08', imageUrl: '/images/forest-aerial.jpg', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
      { id: 'n2', title: 'Midnight Thoughts', artist: 'Artist Two', duration: '4:02', imageUrl: '/images/rainy-window.jpg', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' },
      { id: 'n3', title: 'Summer Vibes', artist: 'Artist Three', duration: '3:30', imageUrl: '/images/golden-beach.jpg', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3' },
      { id: 'n4', title: 'Lost in Tokyo', artist: 'DJ Sakura', duration: '5:12', imageUrl: '/images/rainy-neon-street.jpg', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3' }
    ]
  }
};

const allTracks = Object.values(albumData).flatMap(a => a.tracks);

export default { albumData, allTracks };
