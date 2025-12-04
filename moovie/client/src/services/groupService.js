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

export async function fetchGroupMovies(groupId) {
  const res = await fetch(`${API_ROOT}/${groupId}/movies`);
  if (!res.ok) throw new Error(await res.text());
  return res.json(); // { movies: [...] }
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

export async function removeMember(groupId, userId) {
  const res = await fetch(`${API_ROOT}/${groupId}/members/${userId}`, { method: 'DELETE', headers: authHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function leaveGroup(groupId) {
  const res = await fetch(`${API_ROOT}/${groupId}/leave`, { method: 'DELETE', headers: authHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteGroup(groupId) {
  const res = await fetch(`${API_ROOT}/${groupId}`, { method: 'DELETE', headers: authHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Fetch groups the current user is a member of 
export async function fetchMyGroups() {
  const res = await fetch(`${API_ROOT}/mine`, { headers: authHeaders() });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || 'Failed to fetch user groups');
  }
  return res.json();
}

// Add a movie to a group
export async function addMovieToGroup(groupId, moviePayload) {
  // moviePayload: { movieId, movieName, posterUrl, releaseYear, genre }
  const res = await fetch(`${API_ROOT}/${groupId}/movies`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(moviePayload),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    // server may return { error: '...' }
    throw new Error(json?.error || 'Failed to add movie to group');
  }
  return json; // e.g., { added: true }
}

export default {
  fetchJoinStatus,
  sendJoinRequest,
  cancelJoinRequest,
  fetchGroupDetails,
  fetchPendingRequests,
  fetchGroupMovies,
  approveRequest,
  rejectRequest,
  removeMember,
  leaveGroup,
  deleteGroup,
  fetchMyGroups,
  addMovieToGroup,
};