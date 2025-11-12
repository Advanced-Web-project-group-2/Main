
import React from "react";
import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div>
      <header>
        <h1>Sign Up to Moo-viestar</h1>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/groups">Groups</Link></li>
            <li><Link to="/in-cinemas">In Cinemas</Link></li>
            <li><Link to="/advanced-search">Advanced Search</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
            <li><Link to="/signin">Sign In</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        <section id="signup">
          <h2>Sign Up</h2>

          <form action="#" method="post">
            <input type="text" name="username" placeholder="Username" required />
            <br />
            <input type="email" name="email" placeholder="Email" required />
            <br />
            <input type="password" name="password" placeholder="Password" required />
            <br />
            <button type="submit">Create Account</button>
          </form>

          <p>
            Already have an account? <Link to="/signin">Sign In</Link>
          </p>
        </section>
      </main>

      <footer>
        <p>2025 Moo-viestar</p>
      </footer>
    </div>
  );
}
