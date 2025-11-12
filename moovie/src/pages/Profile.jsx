import React from "react";
import { Link } from "react-router-dom";

export default function Profile() {
  //later fetch user data from backend/API
  const user = {
    username: "Username",
    email: "user@example.com",
    points: 120,
    streak: 14,
    inventory: ["some decoration", "some emoji"],
    groups: ["Group 1", "Group 2"],
    favorites: ["Favorite movie 1", "Favorite movie 2"],
    watchlist: ["Movie on list 1", "Movie on list 2"],
    reviews: [
      {
        movie: "Movie",
        rating: "⭐⭐⭐⭐☆",
        text: "Great movie!",
        date: "2025-02-11",
      },
    ],
  };

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
  <li><Link className="profile" to="/profile">Profile</Link></li>
      <li><Link to="/signup">Sign up</Link></li>
      <li><Link to="/signin">Sign In</Link></li>
    </ul>
  </nav>
</header>

      <main>
        <section id="user-info">
          <h2>{user.username}</h2>
          <p>Email: {user.email}</p>
        </section>

        <section id="points">
          <h3>Your Points</h3>
          <p><strong>{user.points} Points</strong></p>
          <p>Your streak: <strong>{user.streak} days</strong></p>
          <p><Link to="/shop">Visit the Shop →</Link></p>
        </section>

        <section id="inventory">
          <h3>Your Inventory</h3>
          <ul>
            {user.inventory.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>

        <section id="user-groups">
          <h3>Your Groups</h3>
          <ul>
            {user.groups.map((group, idx) => (
              <li key={idx}>{group}</li>
            ))}
          </ul>
        </section>

        <section id="favorites">
          <h3>Your Favorite Movies</h3>
          <ul>
            {user.favorites.map((movie, idx) => (
              <li key={idx}>{movie}</li>
            ))}
          </ul>
        </section>

        <section id="watchlist">
          <h3>My movie list</h3>
          <ul>
            {user.watchlist.map((movie, idx) => (
              <li key={idx}>{movie}</li>
            ))}
          </ul>
        </section>

        <section id="your-reviews">
          <h3>Your Reviews</h3>
          <ul>
            {user.reviews.map((review, idx) => (
              <li key={idx}>
                <strong>{review.rating}</strong>
                <br />
                {review.text}
                <br />
                <em>{review.movie} — {review.date}</em>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer>
        <p>2025 Moo-viestar</p>
      </footer>
    </div>
  );
}

