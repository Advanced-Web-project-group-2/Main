import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/InCinemas.css";

import AddToListButton from '../components/AddToListButton';

export default function InCinemas() {
  const [movies, setMovies] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const API_KEY = import.meta.env. VITE_TMDB_API_KEY;

  useEffect(() => {
    axios
      . get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`)
      .then((res) => setMovies(res.data.results))
      .catch((err) => console.error(err));
  }, []);

  const handleShare = async (movie) => {
    const shareUrl = `${window.location.origin}/movie/${movie.id}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      // Show toast notification
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Unable to copy.   Please try again.');
    }
  };

  return (
    <div className="cinemas-page">
      <h2>🎬 Now Showing in Cinemas</h2>

      {movies.length === 0 ? (
        <p className="loading-text">Loading movies... </p>
      ) : (
        <div className="cinema-grid">
          {movies. map((movie) => (
            <div key={movie.id} className="cinema-card">

              {/* 🎥 Clickable Poster → Movie page */}
              <Link to={`/movie/${movie.id}`}>
                <img
                  className="cinema-poster"
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                      : "https://via.placeholder.com/200x300? text=No+Image"
                  }
                  alt={movie.title}
                />
              </Link>

              {/* 🎬 Info */}
              <div className="cinema-info">
                <h3>{movie.title}</h3>
                <p>
                  <strong>Release: </strong>{" "}
                  {new Date(movie.release_date).toLocaleDateString()}
                </p>

                <div className="cinema-buttons">
                  <button className="btn-warning">❤️ Favorite</button>
                  <AddToListButton movie={movie} />
                  <button 
                    className="btn-secondary" 
                    onClick={() => handleShare(movie)}
                  >
                    🔗 Share
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="toast">
          ✓ Link copied to clipboard!
        </div>
      )}
    </div>
  );
}