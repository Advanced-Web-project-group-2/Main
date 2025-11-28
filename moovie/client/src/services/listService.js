const API_ROOT = '/api/lists';

function authHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getUserLists() {
  const res = await fetch(`${API_ROOT}/`, { headers: authHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json(); // { lists: [...] }
}

export async function addMovieToList(listId, moviePayload) {
  const res = await fetch(`${API_ROOT}/${listId}/movies`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(moviePayload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || 'Failed to add movie to list');
  return json;
}

export async function createList(payload) {
  const res = await fetch(`${API_ROOT}/`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload), // { name, description }
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || 'Failed to create list');
  return json; // { list: {...} }
}

export default { getUserLists, addMovieToList, createList };