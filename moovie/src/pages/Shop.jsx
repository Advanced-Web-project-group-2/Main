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
  <li><Link className="active" to="/shop">Shop</Link></li>
  <li><Link to="/profile">Profile</Link></li>
      <li><Link to="/signup">Sign up</Link></li>
      <li><Link to="/signin">Sign In</Link></li>
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
