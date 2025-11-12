
import React from "react";
import { Link } from "react-router-dom";

export default function AdvancedSearch() {
  return (
    <div>
      <header>
        <h1>Advanced Search</h1>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/groups">Groups</Link></li>
            <li><Link to="/in-cinemas">In Cinemas</Link></li>
            <li><Link to="/advanced-search">Advanced Search</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/signup">Sign up</Link></li>
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
