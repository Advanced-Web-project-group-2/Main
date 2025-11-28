import React, { useState } from 'react';
import groupService from '../../services/groupService';

// Heart icon inside popup window in section In cinemas
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
// End

export default function GroupRow({ group, movie, initiallyAdded = false, onAdded }) {
  const [isAdded, setIsAdded] = useState(Boolean(initiallyAdded));
  const [loading, setLoading] = useState(false);

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
        disabled={loading}
        onClick={handleAddToGroup}
        title={isAdded ? 'Added' : 'Add to group'}
      >
        {loading ? <Spinner /> : isAdded ? <FilledHeartIcon /> : <OutlineHeartIcon />}
      </button>
    </div>
  );
}