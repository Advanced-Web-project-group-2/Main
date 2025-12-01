// src/layouts/Layout.jsx
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { backgroundBrightness } from "../utils/backgroundInfo.js";

export default function Layout() {
  const { user, logout } = useAuth();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("/api/groups/mine", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load groups");

        const data = await res.json();
        setGroups(data.groups || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGroups();
  }, [user]);

  return (
    <div
      className="layout-background"
      style={{
        minHeight: "100vh",
        backgroundImage: background
          ? `url(${background})`
          : "url('/default-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* NAVBAR: keep colors hardcoded so links are always visible */}
      <header className="site-header">
        <h1>Moo-viestar</h1>
        <nav className="main-nav">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li className="dropdown">
              <Link className="dropbtn" to="/groups">Groups</Link>
              <div className="dropdown-content">
                {!user ? (
                  <>
                    <Link to="/signin">Sign in to view groups</Link>
                    <Link to="/signup">Create account</Link>
                  </>
                ) : (
                  <>
                    {groups.length === 0 && <Link to="/groups/create">Create or join a group</Link>}
                    {groups.map(g => (
                      <Link key={g.id} to={`/group/${g.id}`}>{g.name}</Link>
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
                <li><button onClick={logout}>Log Out</button></li>
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

      {/* MAIN & FOOTER: text adapts to background */}
      <div className={`${isDark ? "text-light" : "text-dark"}`}
      style={{
        minHeight: "100vh",
        height: "100%",        // ensure full height
        display: "flex",
        flexDirection: "column",
        backgroundImage: background
          ? `url(${background})`
          : `url('/default-bg.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
    }}
      >
        <main>
          <Outlet context={{ setBackground }} /> {/* child pages can set background */}
        </main>

        <footer>
          <p>2025 Moo-viestar</p>
        </footer>
      </div>
    </div>
  );
}
