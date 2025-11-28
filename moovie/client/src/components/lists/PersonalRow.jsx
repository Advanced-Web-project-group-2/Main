import React, { useState } from 'react';
import listService from '../../services/listService';

function OutlineHeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="1.5"
        d="M12 21s-6.172-4.873-9.172-8.07C-0.02 8.548 3.2 4 6.5 4 8.76 4 10 6 12 8c2-2 3.24-4 5.5-4 3.3 0 6.52 4.548 3.672 8.93C18.172 16.127 12 21 12 21z" />
    </svg>
  );
}
function FilledHeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden focusable="false">
      <path fill="currentColor"
        d="M12 21s-6.172-4.873-9.172-8.07C-0.02 8.548 3.2 4 6.5 4 8.76 4 10 6 12 8c2-2 3.24-4 5.5-4 3.3 0 6.52 4.548 3.672 8.93C18.172 16.127 12 21 12 21z" />
    </svg>
  );
}
function Spinner() {
  return (
    <svg width="18" height="18" viewBox="0 0 50 50" aria-hidden focusable="false">
      <path fill="currentColor" d="M25 5A20 20 0 1 0 45 25" />
    </svg>
  );
}

export default function PersonalRow({ list, movie, initiallyAdded = false, onAdded }) {
  const [isAdded, setIsAdded] = useState(Boolean(initiallyAdded));
  const [loading, setLoading] = useState(false);

  const handleAddToList = async () => {
    if (loading || isAdded) return;
    setLoading(true);
    setIsAdded(true);
    try {
      const res = await listService.addMovieToList(list.id, {
        movieId: movie.id,
        movieName: movie.title,
        posterUrl: movie.poster_path,
        releaseYear: movie.release_year,
        genre: movie.genre,
      });

      if (typeof onAdded === 'function') onAdded({ target: 'list', listId: list.id, movieId: movie.id, result: res });

      try {
        window.dispatchEvent(new CustomEvent('movieAddedToList', { detail: { listId: list.id, movieId: movie.id } }));
      } catch (e) {
        // ignore
      }
    } catch (err) {
      setIsAdded(false);
      console.error('Failed to add to list', err);
      alert(err.message || 'Failed to add movie to list');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="list-picker__row">
      <div className="list-picker__row-info">
        <div className="list-picker__row-title">{list.name}</div>
        {list.description && <div className="list-picker__row-sub">{list.description}</div>}
      </div>

      <button
        className={`list-picker__icon ${isAdded ? 'list-picker__icon--added' : ''}`}
        aria-pressed={isAdded}
        aria-label={`${isAdded ? 'Added to ' : 'Add to '}${list.name}`}
        aria-busy={loading || undefined}
        disabled={loading}
        onClick={handleAddToList}
        title={isAdded ? 'Added' : 'Add to list'}
      >
        {loading ? <Spinner /> : isAdded ? <FilledHeartIcon /> : <OutlineHeartIcon />}
      </button>
    </div>
  );
}