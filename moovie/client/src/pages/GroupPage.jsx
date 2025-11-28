import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import groupService from '../services/groupService';
import '../styles/GroupPageLocked.css';

export default function GroupPage() {
  const { groupId } = useParams();
  const [status, setStatus] = useState('loading'); // loading | not_member | pending | member | admin
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [groupMovies, setGroupMovies] = useState([]);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);
  const [busyRequests, setBusyRequests] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const prevUserRef = useRef(user);

  async function loadAll() {
    setError(null);
    try {
      const [gResp, stResp] = await Promise.all([
        groupService.fetchGroupDetails(groupId).catch(() => null),
        groupService.fetchJoinStatus(groupId).catch(() => ({ status: 'not_member' })),
      ]);
      if (gResp && gResp.group) {
        setGroup(gResp.group);
        // server may return members and pending
        if (Array.isArray(gResp.members)) setMembers(gResp.members || []);
        if (Array.isArray(gResp.pending)) setRequests(gResp.pending || []);
        // if server returned movies include them
        if (Array.isArray(gResp.movies)) setGroupMovies(gResp.movies || []);
      }

      setStatus(stResp.status || 'not_member');

      // fallback: if group endpoint didn't include pending and user is admin, fetch pending separately
      if ((!gResp || !Array.isArray(gResp.pending)) && stResp.status === 'admin') {
        try {
          const pr = await groupService.fetchPendingRequests(groupId);
          setRequests(pr.requests || []);
        } catch (e) {
          // ignore; keep empty
        }
      }

      // fetch group movies explicitly (server now supports GET /:id/movies)
      try {
        const gm = await groupService.fetchGroupMovies(groupId).catch(() => null);
        if (gm && Array.isArray(gm.movies)) setGroupMovies(gm.movies || []);
      } catch (e) {
        // ignore movie loading errors for now
      }
    } catch (err) {
      setError(err.message || String(err));
    }
  }

  useEffect(() => {
    loadAll();
  }, [groupId]);

  // if user logs out while viewing a group, redirect to home
  useEffect(() => {
    if (prevUserRef.current && !user) {
      navigate('/', { replace: true });
    }
    prevUserRef.current = user;
  }, [user, navigate]);

  useEffect(() => {
    const handler = (e) => {
      try {
        const detail = e?.detail;
        if (!detail) return;
        const addedGroupId = detail.groupId;
        if (String(addedGroupId) === String(groupId)) {
          loadAll();
        }
      } catch (err) {
        console.error('movieAddedToGroup handler error', err);
      }
    };

    window.addEventListener('movieAddedToGroup', handler);
    return () => window.removeEventListener('movieAddedToGroup', handler);
  }, [groupId]);

  const handleSend = async () => {
    setBusy(true);
    setError(null);
    try {
      await groupService.sendJoinRequest(groupId);
      setStatus('pending');
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setBusy(false);
    }
  };

  const handleCancel = async () => {
    setBusy(true);
    setError(null);
    try {
      await groupService.cancelJoinRequest(groupId);
      setStatus('not_member');
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setBusy(false);
    }
  };

  const handleLeave = async () => {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await groupService.leaveGroup(groupId);
      setStatus('not_member');
      // reload group info to refresh members list
      await loadAll();
      setMessage('Group left successfully');
      // clear message after a short while
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setBusy(false);
    }
  };

  const setRequestBusy = (userId, val) => {
    setBusyRequests(prev => {
      const next = new Set(prev);
      if (val) next.add(userId); else next.delete(userId);
      return Array.from(next);
    });
  };

  const handleApprove = async (userId, username) => {
    setError(null);
    setRequestBusy(userId, true);
    try {
      await groupService.approveRequest(groupId, userId);
      // remove from requests
      setRequests(prev => prev.filter(r => r.user_id !== userId));
      // add to members list
      setMembers(prev => {
        if (prev.find(m => m.user_id === userId)) return prev;
        return [...prev, { user_id: userId, username, is_admin: false, is_member: true }];
      });
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setRequestBusy(userId, false);
    }
  };

  // Popup to verify memeber remove
  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this user from the group?')) return;
    setError(null);
    setRequestBusy(userId, true);
    try {
      await groupService.removeMember(groupId, userId);
      // remove from members list
      setMembers(prev => prev.filter(m => m.user_id !== userId));
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setRequestBusy(userId, false);
    }
  };

  const handleReject = async (userId) => {
    setError(null);
    setRequestBusy(userId, true);
    try {
      await groupService.rejectRequest(groupId, userId);
      setRequests(prev => prev.filter(r => r.user_id !== userId));
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setRequestBusy(userId, false);
    }
  };

  const getPosterUrl = (poster) => {
    if (!poster) return null;
    if (poster.startsWith('http://') || poster.startsWith('https://')) return poster;
    return `https://image.tmdb.org/t/p/w154${poster}`;
  };

  return (
    <>
      <section id="join-group">
        <h2>{group ? group.name : `Group ${groupId}`}</h2>

        {status === 'loading' && <p>Loading membership status…</p>}

        {status !== 'loading' && (
          <>
            {status === 'not_member' && (
              <button onClick={handleSend} disabled={busy} className="btn">Send Join Request</button>
            )}
            {status === 'pending' && (
              <button onClick={handleCancel} disabled={busy} className="btn">Cancel Request</button>
            )}
            {status === 'member' && (
              <button onClick={handleLeave} disabled={busy} className="btn">Leave Group</button>
            )}

            {(status === 'member' || status === 'admin') && (
              <p>
                Status: <strong>{
                  status === 'admin' ? 'Member (admin)' : 'Member'
                }</strong>
              </p>
            )}
          </>
        )}

        {error && <div className="error">{error}</div>}
        {message && <div className="message">{message}</div>}
      </section>

      { (status === 'member' || status === 'admin') ? (
        <section id="group-content">
          <h2>Welcome to our group!</h2>

          <section id="members">
            <h3>Members list</h3>
            <ul>
              {members.length === 0 && <li>No members loaded</li>}
              {members.map(m => (
                <li key={m.user_id}>
                  {m.username} {m.is_admin && '(admin)'}
                  {status === 'admin' && !m.is_admin && (
                    <button onClick={() => handleRemoveMember(m.user_id)} disabled={busyRequests.includes(m.user_id)} className="btn" style={{ marginLeft: '0.5rem' }}>Remove</button>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section id="group-movies">
            <h3>🎬❤️ Our favourite movies</h3>
            {groupMovies.length === 0 && <p>No movies added to this group yet.</p>}
            <ul className="group-movies-list">
              {groupMovies.map((m) => (
                <li key={m.id} className="group-movie-row">
                  <img
                    className="group-movie-poster"
                    src={getPosterUrl(m.poster_url) || '/src/assets/placeholder-56x84.png'}
                    alt={m.title ? `Poster for ${m.title}` : 'Movie poster'}
                    width="56"
                    height="84"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/src/assets/placeholder-56x84.png'; }}
                  />
                  <div className="group-movie-meta">
                    <div className="group-movie-title">{m.title}</div>
                    {m.release_year && <div className="group-movie-year">({m.release_year})</div>}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {status === 'admin' && (
            <section id="join-requests">
              <h3>Join Requests</h3>
              {requests.length === 0 && <p>No pending requests</p>}
              <ul>
                {requests.map(r => (
                  <li key={r.user_id}>{r.username} 
                    <button onClick={() => handleApprove(r.user_id, r.username)} disabled={busyRequests.includes(r.user_id)} className="btn">Approve</button>
                    <button onClick={() => handleReject(r.user_id)} disabled={busyRequests.includes(r.user_id)} className="btn">Reject</button>
                  </li>
                ))}
              </ul>
            </section>
          )}

        </section>
      ) : (
        <section id="group-content-locked" className={status === 'pending' ? 'locked locked--pending' : 'locked'}>
          <div className="locked-inner">
            <svg className="locked-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path fill="currentColor" d="M17 8h-1V6a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2zM9 6a3 3 0 1 1 6 0v2H9V6z"/>
            </svg>

            <p className="locked-text">
              {status === 'pending'
                ? 'Request pending — wait for admin approval.'
                : 'Apply to group to see group content.'}
            </p>
          </div>
        </section>
      )}
    </>
  );
}
