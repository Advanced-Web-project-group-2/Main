import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function Layout() {
  const { user, logout } = useAuth();
  const [groups, setGroups] = useState(null);
  const [groupsError, setGroupsError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    async function loadGroups() {
      setGroups(null);
      setGroupsError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        setGroups([]);
        return;
      }
      try {
        const res = await fetch("/api/groups/mine", {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        if (!res.ok) {
          if (res.status === 401) {
            // token invalid or missing — clear auth and redirect to sign-in
            logout();
            navigate('/signin', { replace: true });
            return;
          }
          throw new Error("Failed to load groups");
        }
        const data = await res.json();
        if (!cancelled) setGroups(data.groups || []);
      } catch (err) {
        if (!cancelled) {
          setGroupsError(err.message || "Error");
          setGroups([]);
        }
      }
    }
    loadGroups();
    // listen for newly created groups and prepend to dropdown list
    function onGroupCreated(e) {
      if (cancelled) return;
      const g = e?.detail;
      if (!g) return;
      setGroups(prev => {
        if (!prev) return [g];
        if (prev.find(x => x.id === g.id)) return prev;
        return [g, ...prev];
      });
    }
    window.addEventListener('group:created', onGroupCreated);
    return () => { cancelled = true; };
  }, [user]);
  

  return (
    <>
      <header className="site-header">
        <h1>Moo-viestar</h1>

        <nav className="main-nav">
          <ul>
            <li><Link to="/">Home</Link></li>

            <li className="dropdown">
              <Link className="dropbtn" to="/groups">Groups</Link>

              <div className="dropdown-content" role="menu" aria-label="Available groups">
                {groups === null && <div style={{padding: '8px 12px'}}>Loading…</div>}
                {groupsError && <div style={{padding: '8px 12px', color: 'salmon'}}>Error</div>}
                {!user ? (
                  <>
                    <Link role="menuitem" to="/signin">Sign in to view groups</Link>
                    <Link role="menuitem" to="/signup">Create account</Link>
                  </>
                ) : (
                  <>
                    {groups && groups.length === 0 && (
                      <Link role="menuitem" to="/groups/create">Create or join a group</Link>
                    )}
                    {groups && groups.map(g => (
                      <Link key={g.id} role="menuitem" to={`/group/${g.id}`}>{g.name}</Link>
                    ))}
                  </>
                )}
              </div>
            </li>

            <li><Link to="/in-cinemas">In Cinemas</Link></li>
            <li><Link to="/advanced-search">Advanced Search</Link></li>
            <li><Link to="/shop">Shop</Link></li>

            {user ? (
              <>
                <li><Link to="/profile">{user.username}</Link></li>
                <li><button className="btn-warning" onClick={logout}>Log Out</button></li>
              </>
            ) : (
              <>
                <li><Link to="/signup">Sign up</Link></li>
                <li><Link to="/signin">Sign In</Link></li>
              </>
            )}
          </ul>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <p>2025 Moo-viestar</p>
      </footer>
    </>
  );
}
