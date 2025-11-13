
import React from "react";
import { Link } from "react-router-dom";

export default function SignIn() {
  return (
    <div>
<header className="site-header" role="banner">
  <h1>Moo-viestar</h1>
  <nav className="main-nav" role="navigation" aria-label="Primary">
    <ul>
      <li><Link to="/">Home</Link></li>

      <li className="dropdown">
        <Link to="/groups" className="dropbtn">Groups</Link>
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
  <li><Link to="/profile">Profile</Link></li>
      <li><Link to="/signup">Sign up</Link></li>
      <li><Link className="active" to="/signin">Sign In</Link></li>
    </ul>
  </nav>
</header>

      <main>
        <section id="signin">
          <h2>Welcome Back! Please log in</h2>

          <form action="#" method="post">
            <input type="email" name="email" placeholder="Email" required />
            <br />
            <input type="password" name="password" placeholder="Password" required />
            <br />
            <button type="submit">Sign In</button>
          </form>

          <p>
            Don't have an account yet? Create one here{" "}
            <Link to="/signup">Create account</Link>
          </p>
          <p>
            Or go to the <Link to="/">homepage</Link> to sign in quickly.
          </p>
        </section>
      </main>

      <footer>
        <p>2025 Moo-viestar</p>
      </footer>
    </div>
  );
}
