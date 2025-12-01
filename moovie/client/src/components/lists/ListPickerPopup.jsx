import React, { useEffect, useState } from 'react';
import './ListPicker.css';
import groupService from '../../services/groupService';
import listService from '../../services/listService';
import GroupRow from './GroupRow';
import PersonalRow from './PersonalRow';

export default function ListPickerPopup({ movie, open, onClose }) {
  const [groups, setGroups] = useState([]);
  const [lists, setLists] = useState([]);
  const [addedMap, setAddedMap] = useState({});
  const [loading, setLoading] = useState(false);
  
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    let mounted = true;
    setLoading(true);
    Promise.all([groupService.fetchMyGroups(), listService.getUserLists()])
      .then(([gResp, lResp]) => {
        if (!mounted) return;
        // groupService returns { groups: [...] } per getMyGroups earlier
        setGroups(gResp.groups || gResp.groups || []);
        setLists(lResp.lists || []);
      })
      .catch((err) => {
        console.error('Failed to fetch lists/groups', err);
        setError('Failed to load lists');
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [open]);

  // When groups are loaded and a movie is provided, check which groups already contain this movie
  useEffect(() => {
    if (!open || !movie || !groups || groups.length === 0) {
      setAddedMap({});
      return;
    }

    let mounted = true;
    (async () => {
      try {
        const checks = await Promise.all(groups.map(g =>
          groupService.fetchGroupMovies(g.id).catch(() => null)
        ));
        if (!mounted) return;
        const map = {};
        checks.forEach((res, idx) => {
          const g = groups[idx];
          if (!res || !Array.isArray(res.movies)) {
            map[g.id] = false;
            return;
          }
          map[g.id] = res.movies.some(mm => String(mm.id) === String(movie.id));
        });
        setAddedMap(map);
      } catch (err) {
        // ignore — leave map empty
        if (mounted) setAddedMap({});
      }
    })();

    return () => { mounted = false; };
  }, [open, groups, movie]);

  if (!open) return null;

  

  return (
    <div className="list-picker__backdrop" role="dialog" aria-modal="true" aria-labelledby="list-picker-title">
      <div className="list-picker__modal">
        <header className="list-picker__header">
          <div className="list-picker__title" id="list-picker-title">
            Add "{movie?.title || 'movie'}" to...
          </div>
          <button className="list-picker__close" aria-label="Close" onClick={onClose}>✕</button>
        </header>

        <div className="list-picker__body">
          {loading && <div className="list-picker__loading">Loading...</div>}
          {error && <div className="list-picker__error">{error}</div>}

          {!loading && groups && (
            <>
              <div className="list-picker__section-title">Groups</div>
              {groups.length === 0 && <div className="list-picker__empty">You're not in any groups yet.</div>}
              <div className="list-picker__list">
                {groups.map((g) => (
                  <GroupRow key={g.id} group={g} movie={movie} initiallyAdded={Boolean(addedMap[g.id])} />
                ))}
              </div>
            </>
          )}

          {!loading && lists && (
            <>
              <div className="list-picker__section-title">My lists</div>
              {lists.length === 0 && <div className="list-picker__empty">You have no custom lists yet.</div>}
              <div className="list-picker__list">
                {lists.map((l) => (
                  <PersonalRow key={l.id} list={l} movie={movie} initiallyAdded={false} />
                ))}
              </div>
            </>
          )}
        </div>

        <footer className="list-picker__footer">
          <div className="list-picker__actions">
            <button className="list-picker__done" onClick={onClose}>Done</button>
          </div>
        </footer>
      </div>
    </div>
  );
}