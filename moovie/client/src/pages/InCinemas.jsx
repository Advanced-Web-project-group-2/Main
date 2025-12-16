import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/InCinemas.css";

import AddToListButton from '../components/AddToListButton';
import { useAuth } from "../context/AuthContext";

export default function InCinemas() {
  const [movies, setMovies] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const { user, refreshUserData } = useAuth();
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`)
      .then((res) => setMovies(res.data.results))
      .catch((err) => console.error(err));
  }, []);

  const handleShare = async (movie) => {
    const shareUrl = `${window.location.origin}/movie/${movie.id}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Unable to copy. Please try again.');
    }
  };

  const handleAddFavourite = async (movie) => {
    if (!token) return alert("You must be logged in to add to favourites");

    try {
      await fetch("/api/lists/favourites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          movieId: movie.id,
          movieName: movie.title,
          genre: movie.genre_ids?.join(",") || "",
          releaseYear: movie.release_date?.split("-")[0],
          posterUrl: movie.poster_path
            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
            : null,
        }),
      });

      alert("Added to Favourites!");
      refreshUserData();
    } catch (err) {
      console.error(err);
      alert("Failed to add to favourites");
    }
  };

  return (
    <div className="cinemas-page">
      <h2>🎬 Now Showing in Cinemas</h2>

      {movies.length === 0 ? (
        <p className="loading-text">Loading movies...</p>
      ) : (
        <div className="cinema-grid">
          {movies.map((movie) => (
            <div key={movie.id} className="cinema-card">
              <Link to={`/movie/${movie.id}`}>
                <img
                  className="cinema-poster"
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                      : "https://via.placeholder.com/200x300?text=No+Image"
                  }
                  alt={movie.title}
                />
              </Link>

              <div className="cinema-info">
                <h3>{movie.title}</h3>
                <p>
                  <strong>Release: </strong>
                  {new Date(movie.release_date).toLocaleDateString()}
                </p>

                <div className="cinema-buttons">
                  <button
                    className="btn-warning"
                    onClick={() => handleAddFavourite(movie)}
                  >
                    ❤️ Favorite
                  </button>
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

      {showToast && (
        <div className="toast">
          ✓ Link copied to clipboard!
        </div>
      )}
    </div>
  );
}
