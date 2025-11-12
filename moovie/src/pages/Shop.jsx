
import React from "react";
import { Link } from "react-router-dom";

export default function Shop() {
  // Example user points
  const userPoints = 120;

  // Example items in the shop
  const shopItems = [
    { id: 1, name: "Emoji Pack", price: 20 },
    { id: 2, name: "Profile Decoration", price: 50 },
    { id: 3, name: "Group Background Theme", price: 75 },
  ];

  return (
    <div>
      <header>
        <h1>Shop</h1>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/groups">Groups</Link></li>
            <li><Link to="/own-groups">My Groups</Link></li>
            <li><Link to="/in-cinemas">In Cinemas</Link></li>
            <li><Link to="/advanced-search">Advanced Search</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        <section id="user-points">
          <h2>Your Points</h2>
          <p><strong>{userPoints} Points</strong></p>
        </section>

        <section id="shop-items">
          <h2>Available Items</h2>
          <ul>
            {shopItems.map((item) => (
              <li key={item.id}>
                <h3>{item.name}</h3>
                <p>Price: {item.price} Points</p>
                <form action="#" method="post">
                  <button type="submit">Buy</button>
                </form>
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
