import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchMyGroups } from '../services/groupService';
import '../styles/GroupSearch.css';

export default function Groups() {
  const [groups, setGroups] = useState(null);
  const [myGroups, setMyGroups] = useState(null);
  const [error, setError] = useState(null);
  const [myGroupsError, setMyGroupsError] = useState(null);
  const [query, setQuery] = useState('');
  const debounceRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const prevUserRef = useRef(user);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setError(null);
      try {
        const url = `/api/groups${query && query.trim() !== '' ? '?q=' + encodeURIComponent(query) : ''}`;
        const res = await fetch(url);
        if (!res.ok) {
          let bodyText = '';
          try { const body = await res.json(); bodyText = JSON.stringify(body); } catch (e) { bodyText = await res.text().catch(()=>''); }
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

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => load(), 300);

    return () => {
      cancelled = true;
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    async function loadMyGroups() {
      if (!user) {
        setMyGroups([]);
        return;
      }
      setMyGroupsError(null);
      try {
        const data = await fetchMyGroups();
        if (!cancelled) setMyGroups(data.groups || []);
      } catch (err) {
        if (!cancelled) {
          setMyGroupsError(err.message || 'Error loading my groups');
          setMyGroups([]);
        }
      }
    }

    loadMyGroups();

    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    function onGroupCreated(e) {
      if (cancelled) return;
      const g = e?.detail;
      if (!g) return;
      setMyGroups(prev => {
        if (!prev) return [g];
        if (prev.find(x => x.id === g.id)) return prev;
        return [g, ...prev];
      });
    }
    function onGroupLeft(e) {
      if (cancelled) return;
      const d = e?.detail;
      if (!d || !d.id) return;
      setMyGroups(prev => (prev || []).filter(x => String(x.id) !== String(d.id)));
    }
    window.addEventListener('group:created', onGroupCreated);
    window.addEventListener('group:left', onGroupLeft);
    return () => { cancelled = true; window.removeEventListener('group:created', onGroupCreated); };
  }, []);

  return (
    <div className="groups-page">
      <div className="groups-topbar">
        <div className="groups-header">
          <h1>Groups</h1>
          <div className="groups-actions">
            <input
              type="search"
              className="group-search"
              placeholder="Search groups by name..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search groups"
            />
            {user && (
              <Link to="/groups/create" className="btn btn-primary">Create a group</Link>
            )}
          </div>
        </div>
      </div>

      {!user && (
        <div className="groups-signin-message">
          <p><Link to="/signin">Sign in</Link> to view your groups and manage memberships.</p>
        </div>
      )}

      <div className="groups-container">
        {/* Left Column: Available Groups or Search Results */}
        <div className="groups-column">
          <div className="groups-column-box">
            <div className="groups-column-header">
              {query && query.trim() !== '' ? (
                <h2>Search results for "{query}"</h2>
              ) : (
                <h2>Available groups</h2>
              )}
            </div>

            {groups === null && <p className="loading-text">Loading groups…</p>}
            {error && <div className="error">{error}</div>}

            {groups && groups.length === 0 && (
              <div className="groups-empty">
                {query && query.trim() !== '' ? (
                  <>
                    <p>No groups were found matching "{query}".</p>
                    {user ? (
                      <p style={{ marginTop: 12 }}>Try a different search or <Link to="/groups/create">create a new group</Link>.</p>
                    ) : (
                      <p style={{ marginTop: 12 }}>Try a different search.</p>
                    )}
                  </>
                ) : (
                  <>
                    <p>No groups available yet.</p>
                    {user ? (
                      <p style={{ marginTop: 12 }}>Be the first to <Link to="/groups/create">create a group</Link>.</p>
                    ) : (
                      <p style={{ marginTop: 12 }}>Sign in to create a group or join one when available.</p>
                    )}
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
          </div>
        </div>

        {/* Right Column: My Groups */}
        {user && (
          <div className="groups-column">
            <div className="groups-column-box">
              <div className="groups-column-header">
                <h2>My groups</h2>
              </div>

              {myGroupsError && <div className="error">{myGroupsError}</div>}

              {myGroups && myGroups.length === 0 && (
                <div className="groups-empty">
                  <p>You haven't created or joined any groups yet.</p>
                  <p style={{ marginTop: 12 }}><Link to="/groups/create">Create a new group</Link> or join existing group.</p>
                </div>
              )}

              <div className="groups-list">
                {myGroups && myGroups.map(g => (
                  <Link key={g.id} to={`/groups/${g.id}`} className="group-card">
                    {g.banner_url && <img src={g.banner_url} alt={`${g.name} banner`} className="group-banner" />}
                    <div className="group-info">
                      <h3>{g.name}</h3>
                      <small>Created {new Date(g.created_at).toLocaleString()}</small>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}