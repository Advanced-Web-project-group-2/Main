
import React from "react";
import { Link } from "react-router-dom";

export default function Groups() {
  return (
    <div>
      <header className="site-header" role="banner">
        <h1>Moo-viestar</h1>
        <nav className="main-nav" role="navigation" aria-label="Primary">
          <ul>
            <li><Link to="/">Home</Link></li>

            <li className="dropdown">
              <Link to="/groups" className="dropbtn active">Groups</Link>
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
            <li><Link to="/signin">Sign In</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        {/* Create a new group */}
        <section id="create-group">
          <h2>Create New Group</h2>
          <form>
            <input type="text" name="groupName" placeholder="Group name" required />
            <button type="submit">Create Group</button>
          </form>
        </section>

        {/* Group decorations purchased */}
        <section id="featured-decorations">
          <h3>Your Group Decorations</h3>
          <p>You can buy decorations in the <Link to="/shop">Shop</Link>.</p>
        </section>

        {/* All public groups */}
        <section id="public-groups">
          <h2>All Groups</h2>
          <ul>
            <li>
              Horror Fans 
              <Link to="/group/1">Visit Group</Link>
            </li>
            <li>
              Action Movie Lovers 
              <Link to="/group/2">Visit Group</Link>
            </li>
            <li>
              Series Junkies 
              <Link to="/group/3">Visit Group</Link>
            </li>
          </ul>
        </section>

        {/* User’s own groups */}
        <section id="your-groups">
          <h2>Your Groups</h2>
          <ul>
            <li>
              Horror Fans 
              <Link to="/group/1">Open</Link>
            </li>
          </ul>
        </section>
      </main>

      <footer>
        <p>2025 Moo-viestar</p>
      </footer>
    </div>
  );
}
