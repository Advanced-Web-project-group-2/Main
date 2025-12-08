
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { backgroundBrightness } from "../utils/backgroundInfo.js";

export default function Layout() {
  const { user, logout } = useAuth();
  const [groups, setGroups] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [groupsDropdownOpen, setGroupsDropdownOpen] = useState(false);

  const [background, setBackground] = useState(null);
  const [isDark, setIsDark] = useState(false);

  
  useEffect(() => {
    if (background) {
      const fileName = background.split("/").pop();
      const brightness = backgroundBrightness[fileName];
      setIsDark(brightness === "dark");
    } else {
      setIsDark(false);
    }
  }, [background]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setGroups([]);
          return;
        }

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

    const onGroupCreated = (e) => {
      try {
        const g = e?.detail;
        if (!g || !g.id) return;
        setGroups(prev => {
          const exists = (prev || []).some(x => String(x.id) === String(g.id));
          if (exists) return prev;
          return [g, ...(prev || [])];
        });
      } catch (err) {
        console.error('onGroupCreated handler error', err);
      }
    };
    const onGroupLeft = (e) => {
      try {
        const d = e?.detail;
        if (!d || !d.id) return;
        setGroups(prev => (prev || []).filter(g => String(g.id) !== String(d.id)));
      } catch (err) {
        console.error('onGroupLeft handler error', err);
      }
    };

    window.addEventListener('group:created', onGroupCreated);
    window.addEventListener('group:left', onGroupLeft);
    return () => {
      window.removeEventListener('group:created', onGroupCreated);
      window.removeEventListener('group:left', onGroupLeft);
    };
  }, [user]);

  const closeMenu = () => {
    setMenuOpen(false);
    setGroupsDropdownOpen(false);
  };

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
      <header className="site-header">
        <h1>Moo-viestar</h1>
        
        {/* Hamburger Menu Button */}
        <button 
          className="hamburger-menu"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`main-nav ${menuOpen ? "open" : ""}`}>
          <ul>
            <li><Link to="/" onClick={closeMenu}>Home</Link></li>
            <li className={`dropdown ${groupsDropdownOpen ? "open" : ""}`}>
              <Link to="/groups" className="dropbtn" onClick={(e) => {
                const isMobile = window.innerWidth <= 768;
                if (isMobile) {
                  e.preventDefault();
                  setGroupsDropdownOpen(!groupsDropdownOpen);
                } else {
                  closeMenu();
                }
              }}>
                Groups
              </Link>
              <div className="dropdown-content">
                <Link to="/groups" onClick={closeMenu}>View all groups</Link>
                {!user ? (
                  <>
                    <Link to="/signin" onClick={closeMenu}>Sign in to view groups</Link>
                    <Link to="/signup" onClick={closeMenu}>Create account</Link>
                  </>
                ) : (
                  <>
                    {groups.length === 0 && (
                      <Link to="/groups/create" onClick={closeMenu}>Create or join a group</Link>
                    )}
                    {groups.map(g => (
                      <Link key={g.id} to={`/groups/${g.id}`} onClick={closeMenu}>{g.name}</Link>
                    ))}
                  </>
                )}
              </div>
            </li>
            <li><Link to="/in-cinemas" onClick={closeMenu}>In Cinemas</Link></li>
            <li><Link to="/advanced-search" onClick={closeMenu}>Advanced Search</Link></li>
            <li><Link to="/shop" onClick={closeMenu}>Shop</Link></li>

            {user ? (
              <>
                <li><Link to="/profile" onClick={closeMenu}>{user.username}</Link></li>
                <li><button className="logout-btn" onClick={() => { logout(); closeMenu(); }}>Log Out</button></li>
              </>
            ) : (
              <>
                <li><Link to="/signup" onClick={closeMenu}>Sign up</Link></li>
                <li><Link to="/signin" onClick={closeMenu}>Sign In</Link></li>
              </>
            )}
          </ul>
        </nav>
      </header>

      {/* MAIN & FOOTER */}
      <div
        className={`${isDark ? "text-light" : "text-dark"}`}
        style={{
          minHeight: "100vh",
          height: "100%",
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
          <Outlet context={{ setBackground, setIsDark }} />
        </main>

        <footer>
          <p>2025 Moo-viestar</p>
        </footer>
      </div>
    </div>
  );
}