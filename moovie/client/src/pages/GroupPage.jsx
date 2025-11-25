import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import groupService from '../services/groupService';

export default function GroupPage() {
  const { groupId } = useParams();
  const [status, setStatus] = useState('loading'); // loading | not_member | pending | member | admin
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [busyRequests, setBusyRequests] = useState([]);

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
    } catch (err) {
      setError(err.message || String(err));
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              <>
                <button disabled className="btn">Request Sent</button>
                <button onClick={handleCancel} disabled={busy} className="btn">Cancel Request</button>
              </>
            )}
            <p>
              Status: <strong>{
                status === 'not_member'
                  ? 'Not a member'
                  : status === 'admin'
                    ? 'Member (admin)'
                    : status.charAt(0).toUpperCase() + status.slice(1)
              }</strong>
            </p>
          </>
        )}

        {error && <div className="error">{error}</div>}
      </section>

      <section id="group-content">
        <h2>Group Content</h2>

        <section id="members">
          <h3>Members</h3>
          <ul>
            {members.length === 0 && <li>No members loaded</li>}
            {members.map(m => (
              <li key={m.user_id}>
                {m.username} {m.is_admin && '(admin)'}
                {status === 'admin' && !m.is_admin && (
                  <button disabled className="btn" style={{ marginLeft: '0.5rem' }}>Remove</button>
                )}
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
    </>
  );
}
