
import React from "react";
import { Link } from "react-router-dom";
import TopThreeMovies from "../components/TopThreeMovies.jsx"
import banner from "../images/banner.png";
import BasicSearch from "../components/basicSearch.jsx";

export default function Main() {
  return (
    <div>
      <header className="site-header" role="banner">
        <h1>Moo-viestar</h1>
        <nav className="main-nav" role="navigation" aria-label="Primary">
          <ul>
            <li><Link className="active" to="/">Home</Link></li>

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
            <li><Link to="/profile">Profile</Link></li>
            <li className="nav-search"><BasicSearch /></li>
            <li><Link to="/signup">Sign up</Link></li>
            <li><Link to="/signin">Sign In</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        <section id="hero">
          <h2>Welcome to Moo-viestar</h2>
          <p>You found the perfect Webpage for cinema enthusiasts like you!</p>
          <p>You can search all movies and series in the world, make new friends and share your movie interests!</p>
        </section>

        <div className="hero-image">
          {/* banner image */}
          <img src={banner} alt="Cinema banner" />
        </div>

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
          <div>
            <BasicSearch />
          </div>
        </section>

        <section id="in-cinemas">
          {/* <h3>In Cinemas Now</h3>
          <p>Most popular movies in cinemas right now</p> */}
          
            <TopThreeMovies/>
         
          <p><Link to="/in-cinemas">See all movies in cinemas right now</Link></p>
        </section>
      </main>

      <footer>
        <p>2025 Moo-viestar</p>
      </footer>
    </div>
  );
}

