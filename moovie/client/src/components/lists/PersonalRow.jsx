import React, { useState } from 'react';
import listService from '../../services/listService';

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
        // Store full TMDB image URL (same pattern as favourites)
        posterUrl: movie.poster_path
          ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
          : null,
        releaseYear: movie.release_date?.split('-')[0] || movie.release_year,
        genre:
          movie.genres?.map((g) => g.name).join(', ') ||
          movie.genre ||
          null,
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
        {loading ? (
          <Spinner />
        ) : (
          <span aria-hidden className="list-picker__icon-symbol">
            {isAdded ? '✔️' : '➕'}
          </span>
        )}
      </button>
    </div>
  );
}