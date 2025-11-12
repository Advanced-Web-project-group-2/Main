
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <header>
        <h1>Moo-viestar</h1>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/groups">Groups</Link></li>
            <li><Link to="/in-cinemas">In Cinemas</Link></li>
            <li><Link to="/signup">Sign up</Link></li>
            <li><Link to="/signin">Sign In</Link></li>
            <li><Link to="/advanced-search">Advanced Search</Link></li>
            <li><Link to="/shop">Shop</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        <section id="hero">
          <h2>Welcome to Moo-viestar</h2>
          <p>You found the perfect Webpage for cinema enthusiasts like you!</p>
          <p>You can search all movies and series in the world, make new friends and share your movie interests!</p>
        </section>

        <section id="sign-in">
          <h3>Sign In</h3>
          <form>
            <input type="email" name="email" placeholder="Email" />
            <br />
            <input type="password" name="password" placeholder="Password" />
            <br />
            <button type="submit">Sign In</button>
          </form>
          <p>No account yet? <Link to="/signup">Sign Up</Link></p>
        </section>

        <section id="search">
          <h3>Search Movies and Series</h3>
          <form>
            <input type="text" name="query" placeholder="Search movies or series" />
            <button type="submit">Search</button>
          </form>
        </section>

        <section id="in-cinemas">
          <h3>In Cinemas Now</h3>
          <p>Most popular movies in cinemas right now</p>
          <ul id="cinema-list-front">
            {/* JavaScript will populate the 3 most popular movies here */}
          </ul>
          <p><Link to="/in-cinemas">See all movies in cinemas right now</Link></p>
        </section>
      </main>

      <footer>
        <p>2025 Moo-viestar</p>
      </footer>
    </div>
  );
}
