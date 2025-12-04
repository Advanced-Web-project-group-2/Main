import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/GroupSearch.css';

export default function Groups() {
  const [groups, setGroups] = useState(null);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const debounceRef = useRef(null);
  const { user } = useAuth();
  const [unauthenticated, setUnauthenticated] = useState(false);
  const navigate = useNavigate();
  const prevUserRef = useRef(user);


  useEffect(() => {
    let cancelled = false;
    async function load() {
      setError(null);
      setUnauthenticated(false);
      try {
        let res;
        if (query && query.trim() !== '') {
          // search all groups
          const url = `/api/groups?q=${encodeURIComponent(query)}`;
          res = await fetch(url);
        } else {
          // load my groups
          const token = localStorage.getItem('token');
          res = await fetch('/api/groups/mine', {
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          });
        }
        if (!res.ok) {
          if (res.status === 401) {
            try { await res.json(); } catch (_) { /* ignore */ }
            if (!cancelled) {
              setUnauthenticated(true);
              setGroups([]);
              setError(null);
            }
            return;
          }
          let bodyText = '';
          try { const body = await res.json(); bodyText = JSON.stringify(body); } catch (e) { bodyText = await res.text().catch(()=>'' ); }
          throw new Error(`Failed to load groups: ${res.status} ${res.statusText} ${bodyText}`);
        }
        const data = await res.json();
        if (!cancelled) setGroups(data.groups || []);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Error loading groups');
          setGroups([]);
        }
      }
    }

    if (query && query.trim() !== '') {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => load(), 300);
    } else {
      // no query — load my groups immediately
      load();
    }

    return () => {
      cancelled = true;
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [query]);

  // listening for new groups
  useEffect(() => {
    let cancelled = false;
    function onGroupCreated(e) {
      if (cancelled) return;
      const g = e?.detail;
      if (!g) return;
      setGroups(prev => {
        if (!prev) return [g];
        if (prev.find(x => x.id === g.id)) return prev;
        return [g, ...prev];
      });
    }
    function onGroupLeft(e) {
      if (cancelled) return;
      const d = e?.detail;
      if (!d || !d.id) return;
      setGroups(prev => (prev || []).filter(x => String(x.id) !== String(d.id)));
    }
    window.addEventListener('group:created', onGroupCreated);
    window.addEventListener('group:left', onGroupLeft);
    return () => { cancelled = true; window.removeEventListener('group:created', onGroupCreated); };
  }, []);

  useEffect(() => {
    // on sign in, trigger reload
    if (user) {
      setUnauthenticated(false);
      setQuery('');
    }

    // if logging out, redirect to homepage
    if (prevUserRef.current && !user) {
      navigate('/', { replace: true });
    }
    prevUserRef.current = user;
  }, [user]);

  return (
    <div className="groups-page">
      <div className={`groups-topbar ${query && query.trim() !== '' ? 'wide' : 'narrow'}`}>
        <div className="groups-header">
          <h1>Your Groups</h1>
          <div className="groups-actions">
            {(!unauthenticated && user) ? (
              <>
                <input
                  type="search"
                  className="group-search"
                  placeholder="Search groups by name..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  aria-label="Search groups"
                />
                <Link to="/groups/create" className="btn btn-primary">Create a group</Link>
              </>
            ) : (
              <Link to="/signin" className="btn btn-primary">Sign in</Link>
            )}
          </div>
        </div>
      </div>

      {/* If unauthenticated, show the inline prompt only. Otherwise show search/results */}
      {unauthenticated ? (
        <div className="groups-unauthenticated">
          <p>Please sign in to view groups.</p>
        </div>
      ) : (
        <>
          {query && query.trim() !== '' && (
            <div className="groups-search-caption">Search results for "{query}"</div>
          )}

          {groups === null && <p>Loading groups…</p>}

          {error && <div className="error">{error}</div>}

          {groups && groups.length === 0 && (
            <div className="groups-empty">
              {query && query.trim() !== '' ? (
                <>
                  <p>No groups were found matching "{query}".</p>
                  <p style={{marginTop:12}}>Try a different search or <Link to="/groups/create">create a new group</Link>.</p>
                </>
              ) : (
                <>
                  <p>You aren't a member of any groups yet.</p>
                  <Link to="/groups/create" className="btn">Create your first group</Link>
                </>
              )}
            </div>
          )}

          <div className="groups-list">
            {groups && groups.map(g => (
              <Link key={g.id} to={`/groups/${g.id}`} className="group-card">
                {g.banner_url && <img src={g.banner_url} alt={`${g.name} banner`} className="group-banner" />}
                <div className="group-info">
                  <h3>{g.name}</h3>
                  <small>Created {new Date(g.created_at).toLocaleString()}</small>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}