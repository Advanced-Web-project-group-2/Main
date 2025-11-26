// Minimal group API helpers used by GroupPage
const API_ROOT = '/api/groups';

function authHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchJoinStatus(groupId) {
  const res = await fetch(`${API_ROOT}/${groupId}/join-status`, { headers: authHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json(); // { status: 'not_member'|'pending'|'member'|'admin' }
}

export async function sendJoinRequest(groupId) {
  const res = await fetch(`${API_ROOT}/${groupId}/join`, { method: 'POST', headers: authHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function cancelJoinRequest(groupId) {
  const res = await fetch(`${API_ROOT}/${groupId}/join`, { method: 'DELETE', headers: authHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchGroupDetails(groupId) {
  const res = await fetch(`${API_ROOT}/${groupId}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchPendingRequests(groupId) {
  const res = await fetch(`${API_ROOT}/${groupId}/requests`, { headers: authHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json(); // { requests: [...] }
}

export async function approveRequest(groupId, userId) {
  const res = await fetch(`${API_ROOT}/${groupId}/requests/${userId}/approve`, { method: 'POST', headers: authHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function rejectRequest(groupId, userId) {
  const res = await fetch(`${API_ROOT}/${groupId}/requests/${userId}/reject`, { method: 'POST', headers: authHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function leaveGroup(groupId) {
  const res = await fetch(`${API_ROOT}/${groupId}/leave`, { method: 'DELETE', headers: authHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export default {
  fetchJoinStatus,
  sendJoinRequest,
  cancelJoinRequest,
  fetchGroupDetails,
  fetchPendingRequests,
  approveRequest,
  rejectRequest,
  leaveGroup,
};
