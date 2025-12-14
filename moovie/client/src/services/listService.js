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

// ---------------- FAVOURITES ----------------

export async function getFavourites() {
  const res = await fetch(`${API_ROOT}/favourites`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json(); // { favourites: [...] }
}

export async function addFavourite(movie) {
  const res = await fetch(`${API_ROOT}/favourites`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      movieId: movie.id,
      movieName: movie.title || movie.name,
      genre: movie.genres
        ? movie.genres.map((g) => g.name).join(', ')
        : movie.genre || null,
      releaseYear: movie.release_date
        ? movie.release_date.split('-')[0]
        : movie.releaseYear || null,
      posterUrl: movie.poster_path
        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
        : movie.posterUrl || null,
    }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || 'Failed to add to favourites');
  return json;
}

export async function removeFavourite(movieId) {
  const res = await fetch(`${API_ROOT}/favourites`, {
    method: 'DELETE',
    headers: authHeaders(),
    body: JSON.stringify({ movieId }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || 'Failed to remove favourite');
  return json;
}

export default { getUserLists, addMovieToList, createList, getFavourites, addFavourite, removeFavourite,};