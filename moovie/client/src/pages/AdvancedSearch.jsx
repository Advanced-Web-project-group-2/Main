import React, { useState, useEffect } from "react";
import SearchResults from "../components/movies/SearchResults.jsx";
import { getBackgroundByGenre } from "../utils/GenreBackground.js";
import "../styles/background.css";

export default function AdvancedSearch() {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [actor, setActor] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(null);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  const genreMap = {
    Action: 28, Adventure: 12, Animation: 16, Comedy: 35, Crime: 80,
    Documentary: 99, Drama: 18, Family: 10751, Fantasy: 14, History: 36,
    Horror: 27, Music: 10402, Mystery: 9648, Romance: 10749,
    ScienceFiction: 878, TVMovie: 10770, Thriller: 53,
    War: 10752, Western: 37,
  };

  useEffect(() => {
  document.body.classList.add("advanced-search-page");
  return () => document.body.classList.remove("advanced-search-page");
}, []);


  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);

    const bg = getBackgroundByGenre(genre);
    setBackgroundImage(bg);

    try {
      let actorId = null;

      if (actor) {
        const actorRes = await fetch(
          `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${encodeURIComponent(actor)}`
        );
        const actorData = await actorRes.json();
        if (actorData.results?.length > 0) {
          actorId = actorData.results[0].id;
        } else {
          setError("Actor not found.");
          setLoading(false);
          return;
        }
      }

      let genreId = null;
      if (genre) {
        const key = genre.replace(/\s/g, "");
        genreId = genreMap[key];
        if (!genreId) {
          setError("Unknown genre.");
          setLoading(false);
          return;
        }
      }

      let url;
      if (title) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`;
      } else {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}`;
        if (genreId) url += `&with_genres=${genreId}`;
        if (year) url += `&primary_release_year=${year}`;
        if (actorId) url += `&with_cast=${actorId}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (data.results?.length > 0) {
        let filtered = data.results;
        if (title && genreId) {
          filtered = filtered.filter(movie => movie.genre_ids.includes(genreId));
        }
        if (title && year) {
          filtered = filtered.filter(m => m.release_date?.startsWith(year));
        }
        setResults(filtered.slice(0, 20));
      } else {
        setError("No results found.");
      }
    } catch (err) {
      console.error(err);
      setError("Search failed.");
    }

    setLoading(false);
  };

  return (
    <div
      className="advanced-search-container"
      style={{
        backgroundImage: backgroundImage ? `url('${backgroundImage}')` : undefined,
      }}
    >
      <section id="advanced-search">
        <h2>Advanced Movie Search</h2>

        <form onSubmit={handleSearch}>
          <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />

          <label>Genre:</label>
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="">--Any--</option>
            {Object.keys(genreMap).map((g) => (
              <option key={g} value={g}>
                {g.replace(/([A-Z])/g, " $1").trim()}
              </option>
            ))}
          </select>

          <input placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} />
          <input placeholder="Actor Name" value={actor} onChange={(e) => setActor(e.target.value)} />

          <button disabled={loading}>{loading ? "Searching..." : "Search"}</button>
        </form>

        {error && <p className="error">{error}</p>}

        <div style={{ color: backgroundImage ? "#ffffff" : "inherit" }}>
          <SearchResults results={results} />
        </div>
      </section>
    </div>
  );
}