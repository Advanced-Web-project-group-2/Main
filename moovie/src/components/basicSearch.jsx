import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

// Inline search util (moved here to keep search in a single .jsx file)
async function basicSearch(query, limit = 10) {
  if (!query || !query.trim()) return [];
  const q = query.trim();
  const relUrl = `/api/search?q=${encodeURIComponent(q)}`;
  const backendUrl = `http://localhost:5000/api/search?q=${encodeURIComponent(q)}`;

  try {
    let res = await fetch(relUrl);
    const ct = (res.headers.get('content-type') || '').toLowerCase();

    if (!res.ok || !ct.includes('application/json')) {
      // Try backend explicitly
      res = await fetch(backendUrl);
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Search request failed: ${res.status} ${text.substring(0, 200)}`);
    }

    const data = await res.json();
    const results = Array.isArray(data.results) ? data.results : [];
    return results.slice(0, limit);
  } catch (err) {
    console.error('basicSearch error:', err?.message || err);
    return [];
  }
}

// Minimal BasicSearch component.
// Props:
// - limit (number) max results returned
// - placeholder (string) input placeholder
export default function BasicSearch({ limit = 8, placeholder = 'Search movies or series' }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const blurTimeoutRef = useRef(null);
    const wrapperRef = useRef(null);
  const [popupStyle, setPopupStyle] = useState(null);

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    };
  }, []);

  // No popup width measurement needed: CSS will make the popup match the wrapper.

  const onSearch = async (ev) => {
    if (ev && typeof ev.preventDefault === 'function') ev.preventDefault();
    const q = (query || '').trim();
    if (!q) {
      setResults([]);
      return;
    }
    setLoading(true);
    const res = await basicSearch(q, limit);
    setResults(res);
    setLoading(false);
    // position popup after results arrive
    requestAnimationFrame(updatePopupPosition);
  };

  function updatePopupPosition() {
    const el = wrapperRef.current;
    if (!el) return setPopupStyle(null);
    const r = el.getBoundingClientRect();
    setPopupStyle({
      position: 'fixed',
      top: `${Math.round(r.bottom + 4)}px`,
      left: `${Math.round(r.left)}px`,
      width: `${Math.round(r.width)}px`,
      zIndex: 99999,
      maxHeight: '220px',
      overflowY: 'auto',
      background: '#fff',
      border: '1px solid #ddd',
      boxSizing: 'border-box',
      boxShadow: '0 6px 12px rgba(0,0,0,0.08)'
    });
  }

  useEffect(() => {
    function handler() {
      if (results && results.length) updatePopupPosition();
    }
    window.addEventListener('resize', handler);
    window.addEventListener('scroll', handler, true);
    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('scroll', handler, true);
    };
  }, [results]);

  // Hide results shortly after blur so clicks on results still register.
  const onBlur = () => {
    blurTimeoutRef.current = setTimeout(() => setResults([]), 150);
  };

  const onFocus = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
  };

  return (
    <div ref={wrapperRef} className="basic-search" style={{ position: 'relative', display: 'inline-block' }}>
      <form onSubmit={onSearch} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          aria-label={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onSearch();
            }
          }}
          onBlur={onBlur}
          onFocus={onFocus}
          style={{ minWidth: 220 }}
        />
        <button type="button" onClick={onSearch}>Search</button>
      </form>

      {loading && <div style={{ position: 'absolute', top: '100%', left: 0 }}>Searching…</div>}

      {results && results.length > 0 && createPortal(
        <ul className="search-popup" role="listbox" style={{ margin: 0, paddingLeft: 0, ...(popupStyle || {}) }}>
          {results.map((r) => (
            <li key={`${r.id}-${r.media_type || 'm'}`} onMouseDown={() => {
              // prevent blur timeout from clearing results before click
              if (blurTimeoutRef.current) {
                clearTimeout(blurTimeoutRef.current);
                blurTimeoutRef.current = null;
              }
            }}>
              <Link to={`/movie/${r.id}`} className="search-item-link">
                <div className="search-item" style={{display: 'flex', alignItems: 'center'}}>
                  {r.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${r.poster_path}`}
                      alt={r.title || r.name}
                      style={{width: 48, height: 'auto', objectFit: 'cover', marginRight: 8, borderRadius: 4}}
                    />
                  ) : (
                    <div style={{width:48, height:72, background:'#eee', marginRight:8, borderRadius:4}} />
                  )}

                  <div style={{display: 'flex', flexDirection: 'column'}}>
                    <span className="search-title">{r.title || r.name}</span>
                    <small className="search-year" style={{color:'#666'}}>{r.release_date ? `(${(r.release_date || '').slice(0,4)})` : ''}</small>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>,
        document.body
      )}
    </div>
  );
}
