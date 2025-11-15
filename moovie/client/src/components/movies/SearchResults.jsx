import React from "react";
import { Link } from "react-router-dom";

export default function SearchResults({ results }) {
  if (!results || results.length === 0) return null;

  return (
    <ul className="search-results">
      {results.map((movie) => (
        <li key={movie.id}>
          <Link to={`/movie/${movie.id}`}>
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                  : "https://via.placeholder.com/92x138?text=No+Image"
              }
              alt={movie.title}
            />
            <span>{movie.title}</span>
            {movie.release_date && <span> ({movie.release_date.slice(0, 4)})</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
