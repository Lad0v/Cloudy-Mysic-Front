const albumData = {
  'top-100-hits': {
    title: 'Top 100 Hits',
    artist: 'Alejano',
    imageUrl: '/Background ver 1.png',
    tracks: [
      { id: 'p1', title: 'Blinding Lights', artist: 'The Weeknd', duration: '3:20', imageUrl: 'https://images.unsplash.com/photo-1465101178521-c1a6bca7a581?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
      { id: 'p2', title: 'Save Your Tears', artist: 'The Weeknd', duration: '3:11', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
      { id: 'p3', title: 'Stay', artist: 'The Kid LAROI, Justin Bieber', duration: '2:21', imageUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
      { id: 'p4', title: 'Levitating', artist: 'Dua Lipa', duration: '3:23', imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
      { id: 'p5', title: 'Watermelon Sugar', artist: 'Harry Styles', duration: '2:54', imageUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
      { id: 'p6', title: 'Peaches', artist: 'Justin Bieber', duration: '3:18', imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
      { id: 'p7', title: 'Montero', artist: 'Lil Nas X', duration: '2:17', imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
      { id: 'p8', title: 'Bad Habits', artist: 'Ed Sheeran', duration: '3:51', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' }
    ]
  },
  'lo-fi-chill': {
    title: 'Lo-Fi Chill',
    artist: 'Beats & Coffee',
    imageUrl: '/Background ver 2.png',
    tracks: [
      { id: 'n1', title: 'New Beginnings', artist: 'Artist One', duration: '3:08', imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
      { id: 'n2', title: 'Midnight Thoughts', artist: 'Artist Two', duration: '4:02', imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' },
      { id: 'n3', title: 'Summer Vibes', artist: 'Artist Three', duration: '3:30', imageUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3' },
      { id: 'n4', title: 'Lost in Tokyo', artist: 'DJ Sakura', duration: '5:12', imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1000&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3' }
    ]
  }
};

const allTracks = Object.values(albumData).flatMap(a => a.tracks);

export default { albumData, allTracks };
