import React, { useState, useEffect } from 'react';
import groupService from '../../services/groupService';

function Spinner() {
  return (
    <svg width="18" height="18" viewBox="0 0 50 50" aria-hidden focusable="false">
      <path fill="currentColor" d="M25 5A20 20 0 1 0 45 25" />
    </svg>
  );
}

export default function GroupRow({ group, movie, initiallyAdded = false, onAdded }) {
  const [isAdded, setIsAdded] = useState(Boolean(initiallyAdded));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsAdded(Boolean(initiallyAdded));
  }, [initiallyAdded]);

  const handleAddToGroup = async () => {
    if (loading || isAdded) return; // prevent duplicate clicks 
    setLoading(true);
    setIsAdded(true);
    try {
      const res = await groupService.addMovieToGroup(group.id, {
        movieId: movie.id,
        movieName: movie.title,
        posterUrl: movie.poster_path,
        releaseYear: movie.release_year,
        genre: movie.genre,
      });

      if (typeof onAdded === 'function') {
        onAdded({ target: 'group', groupId: group.id, movieId: movie.id, result: res });
      }

      try {
        window.dispatchEvent(new CustomEvent('movieAddedToGroup', {
          detail: { groupId: group.id, movieId: movie.id }
        }));
      } catch (e) {

      }
    } catch (err) {
      setIsAdded(false);
      console.error('Failed to add to group', err);
      alert(err.message || 'Failed to add movie to group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="list-picker__row">
      <div className="list-picker__row-info">
        <div className="list-picker__row-title">{group.name}</div>
        {group.members_count != null && (
          <div className="list-picker__row-sub">{group.members_count} members</div>
        )}
      </div>

      <button
        className={`list-picker__icon ${isAdded ? 'list-picker__icon--added' : ''}`}
        aria-pressed={isAdded}
        aria-label={`${isAdded ? 'Added to ' : 'Add to '}${group.name}`}
        aria-busy={loading || undefined}
        disabled={loading || isAdded}
        onClick={handleAddToGroup}
        title={isAdded ? 'Added' : 'Add to group'}
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