import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateGroup.css';
import cowWrite from "../assets/images/Lehmä_login_writing.png";

export default function CreateGroup(){
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e){
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      alert('Group name required.');
      return;
    }
    setLoading(true);
    try{
      const token = localStorage.getItem('token');
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ name: name.trim(), description: description.trim() || null })
      });

      if (!res.ok) {
        const body = await res.json().catch(()=> ({}));
        throw new Error(body.error || 'Failed to create group');
      }

      const data = await res.json();
      const group = data.group;
      try {
        window.dispatchEvent(new CustomEvent('group:created', { detail: group }));
      } catch (e) {}
      navigate('/groups');
    }catch(err){
      const msg = err.message || 'Error';
      setError(msg);
      alert(msg);
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="create-group-container">
      <img src={cowWrite} alt="Cow" className="create-cow-img" />
      <div className="create-cow-bottom-line" />
      <div className="create-group-box">
        <h2 className="create-group-title">Create Group</h2>
        <form onSubmit={handleSubmit} className="create-group-form">
          <div className="create-group-inner">
            <label>
              Name
              <input
                className="create-list-input"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="New group name"
              />
            </label>

            <label className="group-description-label">
              Description
              <textarea
                className="create-list-description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Description (optional)"
              />
            </label>
          </div>

          <div className="create-list-actions">
            <button type="submit" className="create-list-button" disabled={loading}>
              {loading ? 'Creating...' : 'Create Group'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
