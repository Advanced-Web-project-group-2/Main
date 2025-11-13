import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function InCinemas() {
  const [movies, setMovies] = useState([]);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;


  useEffect(() => {
    // Fetch movies currently in cinemas
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`
        );
        setMovies(response.data.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

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

            <li><Link className="active" to="/in-cinemas">In Cinemas</Link></li>
            <li><Link to="/advanced-search">Advanced Search</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/signup">Sign up</Link></li>
            <li><Link to="/signin">Sign In</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        <section id="cinema-list">
          <h2>All Movies currently in cinemas</h2>
          <ul>
            {movies.length === 0 ? (
              <p>Loading movies...</p>
            ) : (
              movies.map((movie) => (
                <li key={movie.id}>
                  <h3>{movie.title}</h3>
                  <p>Release date: {movie.release_date}</p>
                  <p>{movie.overview}</p>
                  {movie.poster_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                      alt={movie.title}
                    />
                  )}
                  <br />
                  <Link to={`/movie/${movie.id}`}>See Details</Link>
                </li>
              ))
            )}
          </ul>
        </section>
      </main>

      <footer>
        <p>2025 Moo-viestar</p>
      </footer>
    </div>
  );
}