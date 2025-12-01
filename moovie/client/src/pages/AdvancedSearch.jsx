import React, { useState, useEffect } from "react";
import SearchResults from "../components/movies/SearchResults.jsx";
import { getBackgroundByGenre } from "../utils/GenreBackground.js";
import "../styles/background.css";
import { Link } from "react-router-dom";
import AddToListButton from "../components/AddToListButton";
import "../styles/AdvancedSearch.css";

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
    ScienceFiction: 878, TVMovie: 10770, Thriller: 53, War: 10752, Western: 37,
  };

  // Convert genre ID → name
  const genreIdToName = Object.fromEntries(
    Object.entries(genreMap).map(([name, id]) => [id, name])
  );

  useEffect(() => {
    document.body.classList.add("advanced-search-page");
    return () => document.body.classList.remove("advanced-search-page");
  }, []);

  useEffect(() => {
    if (backgroundImage) {
      document.body.style.backgroundImage = `url('${backgroundImage}')`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundAttachment = "fixed";
    } else {
      document.body.style.backgroundImage = ""; // Restore default
    }
    return () => {
      document.body.style.backgroundImage = "";
    };
  }, [backgroundImage]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);

    // 🎨 Change the background
    setBackgroundImage(getBackgroundByGenre(genre));

    try {
      let actorId = null;

      if (actor) {
        const actorRes = await fetch(
          `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${encodeURIComponent(actor)}`
        );
        const actorData = await actorRes.json();
        if (actorData.results?.length > 0) {
          actorId = actorData.results[0].id;
        }
      }

      const genreId = genreMap[genre.replace(/\s/g, "")] || null;

      let url = title
        ? `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`
        : `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}${genreId ? `&with_genres=${genreId}` : ""}${year ? `&primary_release_year=${year}` : ""}${actorId ? `&with_cast=${actorId}` : ""}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.results?.length > 0) {
        let filtered = data.results;

        // Only apply filtering if searching via title
        if (title && genreId) {
          filtered = filtered.filter((movie) =>
            movie.genre_ids?.includes(genreId)
          );
        }
        if (title && year) {
          filtered = filtered.filter((m) =>
            m.release_date?.startsWith(year)
          );
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

        {/* 🔍 Search Form */}
        <div className="search-box">
          <form onSubmit={handleSearch} className="search-form">
            <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />

            <select value={genre} onChange={(e) => setGenre(e.target.value)}>
              <option value="">Genre</option>
              {Object.keys(genreMap).map((g) => (
                <option key={g} value={g}>
                  {g.replace(/([A-Z])/g, " $1").trim()}
                </option>
              ))}
            </select>

            <input placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} />
            <input placeholder="Actor Name" value={actor} onChange={(e) => setActor(e.target.value)} />

            <button disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </form>
        </div>

        {error && <p className="error">{error}</p>}

        {/* 🎬 Search Results */}
        <div className="results-container" style={{ color: backgroundImage ? "#fff" : "inherit" }}>
          {results.length === 0 ? (
            <p>No results yet.</p>
          ) : (
            results.map((movie) => (
              <div key={movie.id} className="movie-card">
                <Link to={`/movie/${movie.id}`}>
                  <img
                    className="movie-thumbnail"
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                        : "https://via.placeholder.com/200x300?text=No+Image"
                    }
                    alt={movie.title}
                  />
                </Link>

                <div className="movie-details">
                  <h2>{movie.title}</h2>
                  <p><strong>Year:</strong> {movie.release_date?.slice(0, 4) || "Unknown"}</p>
                  <p>
                    <strong>Genres:</strong>{" "}
                    {movie.genre_ids
                      ? movie.genre_ids.map((id) => genreIdToName[id] || id).slice(0, 5).join(", ")
                      : "N/A"}
                  </p>

                  <div className="movie-buttons">
                    <button>❤️ Add to Favorites</button>
                    <AddToListButton movie={movie} /> {/* Popup window for "Add to List" */}
                    <button>🔗 Share</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
