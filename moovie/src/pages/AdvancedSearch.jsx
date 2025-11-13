import React, { useState } from "react";
import { Link } from "react-router-dom";
import SearchResults from "../components/SearchResults.jsx";

export default function AdvancedSearch() {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");   
  const [actor, setActor] = useState(""); 
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  // Map genre names to TMDB genre IDs
  const genreMap = {
    Action: 28,
    Adventure: 12,
    Animation: 16,
    Comedy: 35,
    Crime: 80,
    Documentary: 99,
    Drama: 18,
    Family: 10751,
    Fantasy: 14,
    History: 36,
    Horror: 27,
    Music: 10402,
    Mystery: 9648,
    Romance: 10749,
    ScienceFiction: 878,
    TVMovie: 10770,
    Thriller: 53,
    War: 10752,
    Western: 37,
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);

    try {
      let actorId = null;

      // Get actor ID if actor name entered
      if (actor) {
        const actorRes = await fetch(
          `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(actor)}&page=1&include_adult=false`
        );
        const actorData = await actorRes.json();
        if (actorData.results && actorData.results.length > 0) {
          actorId = actorData.results[0].id;
        } else {
          setError("Actor not found.");
          setLoading(false);
          return;
        }
      }

      // Convert genre name to ID
      let genreId = null;
      if (genre) {
        const key = genre.replace(/\s/g, ""); // e.g., "Science Fiction" → "ScienceFiction"
        genreId = genreMap[key];
        if (!genreId) {
          setError("Unknown genre. Try e.g., Action, Horror, Comedy.");
          setLoading(false);
          return;
        }
      }

      // Determine which API call to use
      let url;
      if (title) {
        // Search by title
        url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(title)}&page=1&include_adult=false`;
      } else {
        // Discover for filters (actor/genre/year) only
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&include_adult=false&sort_by=popularity.desc`;
        if (genreId) url += `&with_genres=${genreId}`;
        if (year) url += `&primary_release_year=${year}`;
        if (actorId) url += `&with_cast=${actorId}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        let filtered = data.results;

        // Client-side filtering for genre/year when using title search
        if (title) {
          if (genreId) {
            filtered = filtered.filter(
              (movie) => movie.genre_ids && movie.genre_ids.includes(genreId)
            );
          }

          if (year) {
            filtered = filtered.filter(
              (movie) => movie.release_date && movie.release_date.startsWith(year)
            );
          }
        }

        if (filtered.length > 0) {
          setResults(filtered.slice(0, 20));
        } else {
          setError("No results found for these criteria.");
        }
      } else {
        setError("No results found.");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching data. Please try again later.");
    } finally {
      setLoading(false);
    }
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
            <li><Link className="active" to="/advanced-search">Advanced Search</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/signup">Sign up</Link></li>
            <li><Link to="/signin">Sign In</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        <section id="advanced-search">
          <h2>Advanced Movie Search</h2>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <br />

            {/* Genre dropdown */}
            <label htmlFor="genre">Genre:</label>
            <select
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              <option value="">--Any--</option>
              {Object.keys(genreMap).map((g) => (
                <option key={g} value={g}>
                  {g.replace(/([A-Z])/g, " $1").trim()}
                </option>
              ))}
            </select>
            <br />

            <input
              type="text"
              placeholder="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
            <br />
            <input
              type="text"
              placeholder="Actor Name"
              value={actor}
              onChange={(e) => setActor(e.target.value)}
            />
            <br />
            <button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </form>

          {error && <p className="error">{error}</p>}

          <SearchResults results={results} />
        </section>
      </main>

      <footer>
        <p>2025 Moo-viestar</p>
      </footer>
    </div>
  );
}
