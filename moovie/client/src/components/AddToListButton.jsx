// Add button in popup window in In cinemas
import React, { useState } from 'react';
import ListPickerPopup from './lists/ListPickerPopup';

export default function AddToListButton({ movie }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="add-to-list-button btn-warning"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={`Add ${movie?.title || 'movie'} to list`}
      >
        <span>📋 Add to list</span>
      </button>

      <ListPickerPopup movie={movie} open={open} onClose={() => setOpen(false)} />
    </>
  );
}