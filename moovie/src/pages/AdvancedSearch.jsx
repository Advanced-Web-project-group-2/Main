
import React from "react";
import { Link } from "react-router-dom";

export default function AdvancedSearch() {
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
            <li><Link className="active"to="/advanced-search">Advanced Search</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/signup">Sign up</Link></li>
            <li><Link to="/signin">Sign In</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        <section id="advanced-search">
          <h2>Advanced Movie and Series Search</h2>
          <form>
            <input type="text" name="title" placeholder="Title" />
            <br />
            <input type="text" name="genre" placeholder="Genre" />
            <br />
            <input type="text" name="year" placeholder="Year" />
            <br />
            <input type="text" name="rating" placeholder="Rating" />
            <br />
            <button type="submit">Search</button>
          </form>
        </section>
      </main>

      <footer>
        <p>2025 Moo-viestar</p>
      </footer>
    </div>
  );
}
