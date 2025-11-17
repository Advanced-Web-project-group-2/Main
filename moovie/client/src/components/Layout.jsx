import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  

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
                <Link role="menuitem" to="/group/1">Horror Fans</Link>
                <Link role="menuitem" to="/group/2">Action Movie Lovers</Link>
                <Link role="menuitem" to="/group/3">Series Junkies</Link>
                <Link role="menuitem" to="/group/4">Indie Hippies</Link>
                <Link role="menuitem" to="/group/5">Family Picks</Link>
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
