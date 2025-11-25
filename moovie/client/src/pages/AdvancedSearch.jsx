import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/AdvancedSearch.css";

export default function AdvancedSearch() {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [actor, setActor] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  const genreMap = {
    Action: 28, Adventure: 12, Animation: 16, Comedy: 35, Crime: 80,
    Documentary: 99, Drama: 18, Family: 10751, Fantasy: 14, History: 36,
    Horror: 27, Music: 10402, Mystery: 9648, Romance: 10749,
    ScienceFiction: 878, TVMovie: 10770, Thriller: 53,
    War: 10752, Western: 37,
  };

  const genreIdToName = Object.fromEntries(
    Object.entries(genreMap).map(([name, id]) => [id, name])
  );

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);

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

      let genreId = genreMap[genre.replace(/\s/g, "")] || null;

      let url = title
        ? `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`
        : `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}${genreId ? `&with_genres=${genreId}` : ""
        }${year ? `&primary_release_year=${year}` : ""}${actorId ? `&with_cast=${actorId}` : ""
        }`;

      const res = await fetch(url);
      const data = await res.json();
      setResults(data.results?.slice(0, 20) || []);
    } catch {
      setError("Search failed.");
    }
    setLoading(false);
  };

  return (
    <div className="advanced-search-page">

      {/* 🔍 Search Bar */}
      <div className="search-box">
        <form onSubmit={handleSearch} className="search-form">
          <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />

          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="">Genre</option>
            {Object.keys(genreMap).map((g) => (
              <option key={g} value={g}>{g.replace(/([A-Z])/g, " $1").trim()}</option>
            ))}
          </select>

          <input placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} />
          <input placeholder="Actor" value={actor} onChange={(e) => setActor(e.target.value)} />

          <button disabled={loading}>{loading ? "Searching..." : "Search"}</button>
        </form>
      </div>

      {error && <p className="error">{error}</p>}

      {/* 🎬 Results */}
      <div className="results-container">
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
                <p><strong>Year:</strong> {movie.release_date?.slice(0, 4)}</p>
                <p>
                  <strong>Genres:</strong>{" "}
                  {movie.genre_ids
                    ? movie.genre_ids
                      .map((id) => genreIdToName[id] || id)
                      .slice(0, 5)
                      .join(", ")
                    : "N/A"}
                </p>

                <div className="movie-buttons">
                  <button>❤️ Add to Favorites</button>
                  <button>📋 Add to List</button>
                  <button>🔗 Share</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div >
  );
}
