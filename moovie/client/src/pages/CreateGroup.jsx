import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateGroup(){
  const [name, setName] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e){
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError('Group name is required');
    setLoading(true);
    try{
      const token = localStorage.getItem('token');
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ name: name.trim(), banner_url: bannerUrl || null, icon_url: iconUrl || null })
      });

      if (!res.ok) {
        const body = await res.json().catch(()=> ({}));
        throw new Error(body.error || 'Failed to create group');
      }

      const data = await res.json();
      const group = data.group;
      // notify other pages/components about new group so they can update immediately
      try {
        window.dispatchEvent(new CustomEvent('group:created', { detail: group }));
      } catch (e) {}
      // navigate to groups list so user sees the new group
      navigate('/groups');
    }catch(err){
      setError(err.message || 'Error');
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="create-group-page">
      <h2>Create Group</h2>
      <form onSubmit={handleSubmit} className="create-group-form">
        <label>
          Name
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Group name" />
        </label>
        <label>
          Banner URL (optional)
          <input value={bannerUrl} onChange={e=>setBannerUrl(e.target.value)} placeholder="https://..." />
        </label>
        <label>
          Icon URL (optional)
          <input value={iconUrl} onChange={e=>setIconUrl(e.target.value)} placeholder="https://..." />
        </label>
        {error && <div className="form-error">{error}</div>}
        <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Group'}</button>
      </form>
    </div>
  );
}
