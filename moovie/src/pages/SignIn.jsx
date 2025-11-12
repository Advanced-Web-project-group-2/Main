
import React from "react";
import { Link } from "react-router-dom";

export default function SignIn() {
  return (
    <div>
      <header>
        <h1>Sign In</h1>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/groups">Groups</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/in-cinemas">In Cinemas</Link></li>
            <li><Link to="/signup">Sign up</Link></li>
            <li><Link to="/advanced-search">Advanced Search</Link></li>
            <li><Link to="/own-groups">My own groups</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/movie">Movie Info</Link></li>
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
