
import React from "react";
import { Link } from "react-router-dom";

export default function Groups() {
  return (
    <div>
      <header>
        <h1>Groups</h1>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/in-cinemas">In Cinemas</Link></li>
            <li><Link to="/advanced-search">Advanced Search</Link></li>
            <li><Link to="/groups">Groups</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/signup">Sign up</Link></li>
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
              <Link to="/group-page?groupId=1">Visit Group</Link>
            </li>
            <li>
              Action Movie Lovers 
              <Link to="/group-page?groupId=2">Visit Group</Link>
            </li>
            <li>
              Series Junkies 
              <Link to="/group-page?groupId=3">Visit Group</Link>
            </li>
          </ul>
        </section>

        {/* User’s own groups */}
        <section id="your-groups">
          <h2>Your Groups</h2>
          <ul>
            <li>
              Horror Fans 
              <Link to="/group-page?groupId=1">Open</Link>
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
