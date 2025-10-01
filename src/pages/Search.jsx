import React, { useState } from 'react';

// Stubbed API call to a different service
// async function fetchOtherApi(query) {
//   const url = `${import.meta.env.VITE_API_URL}/search?q=${encodeURIComponent(query)}`;
//   const resp = await fetch(url, {
//     headers: {
//       'Content-Type': 'application/json',
//       // Если нужен ключ:
//       // 'Authorization': `Bearer ${import.meta.env.VITE_API_TOKEN}`,
//       // или 'x-api-key': import.meta.env.VITE_API_KEY,
//     },
//   });
//
//   if (!resp.ok) {
//     throw new Error(`HTTP ${resp.status}`);
//   }
//   const json = await resp.json();
//
//   // Приведи ответ к формату результатов страницы:
//   // [{ id, title, subtitle, imageUrl }]
//   return json.items.map(item => ({
//     id: item.id,
//     title: item.name,
//     subtitle: item.artist ?? item.album ?? '',
//     imageUrl: item.image ?? 'https://via.placeholder.com/64',
//   }));
// }
// Replace mockFetchOtherApi with a real fetch when the API is ready
async function mockFetchOtherApi(query, filters = {}) {
  // Simulate network latency
  await new Promise((res) => setTimeout(res, 700));

  // Return mocked data structure
  // Include filters in subtitle to simulate server-side filtering
  const filterTag = [filters.genre, filters.year, filters.mood, filters.duration, filters.type].filter(Boolean).join(' · ');
  return [
    { id: 'trk_1', title: `Result for "${query}" #1`, subtitle: `Stub Artist${filterTag ? ' · ' + filterTag : ''}`, imageUrl: 'https://via.placeholder.com/64' },
    { id: 'trk_2', title: `Result for "${query}" #2`, subtitle: `Stub Album${filterTag ? ' · ' + filterTag : ''}`, imageUrl: 'https://via.placeholder.com/64' },
    { id: 'trk_3', title: `Result for "${query}" #3`, subtitle: `Stub Playlist${filterTag ? ' · ' + filterTag : ''}`, imageUrl: 'https://via.placeholder.com/64' },
  ];
}

export default function Search() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);

  // Filters panel state
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    genre: null,
    year: null,
    mood: null,
    duration: null,
    type: null,
  });
  // Temporary filters while panel is open (controlled by parent)
  const [panelFilters, setPanelFilters] = useState({
    genre: null,
    year: null,
    mood: null,
    duration: null,
    type: null,
  });

  // When opening the panel, initialize panelFilters from activeFilters
  const openFilters = () => {
    setPanelFilters(activeFilters);
    setShowFilters(true);
  };

  const onSearch = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    setResults([]);
    if (!query.trim()) return;

    setLoading(true);
    try {
      const data = await mockFetchOtherApi(query.trim(), activeFilters);
      setResults(data);
    } catch (err) {
      setError('Ошибка при выполнении запроса (заглушка)');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (filters) => {
    setActiveFilters(filters);
    setShowFilters(false);
    if (query.trim()) {
      // run search with filters
      (async () => {
        setLoading(true);
        setError('');
        try {
          const data = await mockFetchOtherApi(query.trim(), filters);
          setResults(data);
        } catch (err) {
          setError('Ошибка при выполнении запроса (заглушка)');
        } finally {
          setLoading(false);
        }
      })();
    }
  };

  const clearFilters = () => {
    setActiveFilters({ genre: null, year: null, mood: null, duration: null, type: null });
  };

  return (
    <div className="search-page">
      <h1>Поиск</h1>
      {/* Active filters line (above search) - always shown */}
      <div className="active-filters-line" style={{ marginBottom: 8 }}>
        <strong style={{ marginRight: 8, fontWeight: 600 }}>Фильтры:</strong>
        {Object.values(activeFilters).some(Boolean) ? Object.values(activeFilters).filter(Boolean).join(' · ') : 'нет'}
      </div>

      <form className="search-form" onSubmit={onSearch}>
        <input
          type="text"
          placeholder="Введите запрос..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button" disabled={loading}>
          {loading ? 'Поиск...' : 'Искать'}
        </button>

        <button
          type="button"
          className="search-button filters-button"
          onClick={openFilters}
          aria-expanded={showFilters}
        >
          Фильтры
        </button>
      </form>

      {error && <div className="error-text">{error}</div>}

      <div className="results-grid">
        {results.map((item) => (
          <div key={item.id} className="recommendation-card">
            <img src={item.imageUrl} alt={item.title} className="recommendation-image" />
            <div className="recommendation-info">
              <h3 className="recommendation-title">{item.title}</h3>
              <p className="recommendation-subtitle">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {!loading && results.length === 0 && !error && (
        <p className="muted-text">Введите запрос и нажмите "Искать". Сейчас используется заглушка API.</p>
      )}

      {/* Filters panel overlay */}
      {showFilters && (
        <div className="filters-overlay" onClick={() => { applyFilters(panelFilters); }} aria-hidden>
          <div className="filters-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Фильтры поиска">
            <FiltersPanel
              filters={panelFilters}
              setFilters={setPanelFilters}
              onApply={applyFilters}
              onClear={() => { clearFilters(); setPanelFilters({ genre: null, year: null, mood: null, duration: null, type: null }); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}


function FiltersPanel({ filters, setFilters, onApply, onClear }) {
  // filters and setFilters are controlled by parent (Search)
  const genres = ['Поп', 'Рок', 'Рэп', 'Классика', 'EDM'];
  const years = ['2020-2025', '2010-2019', '<2000'];
  const moods = ['🎉 Вечеринка', '🧘 Спокойная', '😢 Грустная', '💪 Энергичная'];
  const durations = ['<2 мин', '2-5 мин', '>5 мин'];
  const types = ['Оригинал', 'Ремикс', 'Live'];
  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h2 style={{ margin: 0 }}>Фильтры</h2>
        {/* Header controls removed as requested */}
      </div>

      <div style={{ overflowY: 'auto', paddingRight: 6 }}>
        <FilterSection title="Жанр">
          {genres.map((g) => (
            <button key={g} className={`filter-option ${filters.genre === g ? 'active' : ''}`} onClick={() => setFilters({ ...filters, genre: filters.genre === g ? null : g })}>{g}</button>
          ))}
        </FilterSection>

        <FilterSection title="Год">
          {years.map((y) => (
            <button key={y} className={`filter-option ${filters.year === y ? 'active' : ''}`} onClick={() => setFilters({ ...filters, year: filters.year === y ? null : y })}>{y}</button>
          ))}
        </FilterSection>

        <FilterSection title="Настроение">
          {moods.map((m) => (
            <button key={m} className={`filter-option ${filters.mood === m ? 'active' : ''}`} onClick={() => setFilters({ ...filters, mood: filters.mood === m ? null : m })}>{m}</button>
          ))}
        </FilterSection>

        <FilterSection title="Длительность">
          {durations.map((d) => (
            <button key={d} className={`filter-option ${filters.duration === d ? 'active' : ''}`} onClick={() => setFilters({ ...filters, duration: filters.duration === d ? null : d })}>{d}</button>
          ))}
        </FilterSection>

        <FilterSection title="Тип">
          {types.map((t) => (
            <button key={t} className={`filter-option ${filters.type === t ? 'active' : ''}`} onClick={() => setFilters({ ...filters, type: filters.type === t ? null : t })}>{t}</button>
          ))}
        </FilterSection>
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button className="search-button" onClick={() => onApply(filters)}>Применить</button>
        <button className="search-button" onClick={() => { setFilters({ genre: null, year: null, mood: null, duration: null, type: null }); onClear(); }}>Сбросить</button>
      </div>
    </div>
  );
}

function FilterSection({ title, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <h4 style={{ margin: '8px 0' }}>{title}</h4>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{children}</div>
    </div>
  );
}
