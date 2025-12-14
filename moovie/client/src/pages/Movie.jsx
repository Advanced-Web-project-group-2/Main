import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "../styles/Movie.css";
import "../styles/likes.css";
import AddToListButton from "../components/AddToListButton";
import { addFavourite } from "../services/listService";


export default function Movie() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [avatarCache, setAvatarCache] = useState({});
  const [votes, setVotes] = useState({}); // { reviewId: 'like' | 'dislike' | null }
  const { user, refreshUserData } = useAuth();

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const token = localStorage.getItem("token");

  // Fetch movie data
  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`)
      .then((res) => setMovie(res.data))
      .catch(console.error);
  }, [movieId]);

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`/api/reviews/${movieId}`);
      setReviews(res.data.reviews);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [movieId]);

  // Fetch avatars per unique reviewer
  useEffect(() => {
    const loadAvatars = async () => {
      const uniqueUserIds = [...new Set(reviews.map((r) => r.user_id))];
      const newAvatars = { ...avatarCache };

      for (const userId of uniqueUserIds) {
        if (!newAvatars[userId]) {
          try {
            const res = await fetch(`/shop/equipped/${userId}`);
            const data = await res.json();
            newAvatars[userId] = data.equipped || [];
          } catch {
            newAvatars[userId] = [];
          }
        }
      }
      setAvatarCache(newAvatars);
    };

    if (reviews.length > 0) loadAvatars();
  }, [reviews]);

  // Listen for movie added to group event to refresh credits
  useEffect(() => {
    const handleMovieAddedToGroup = () => {
      refreshUserData();
    };
    
    window.addEventListener('movieAddedToGroup', handleMovieAddedToGroup);
    return () => window.removeEventListener('movieAddedToGroup', handleMovieAddedToGroup);
  }, [refreshUserData]);

  if (!movie) return <p>Loading...</p>;

  // Submit review
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("You must be logged in to submit a review");

    try {
      const res = await axios.post(
        "/api/reviews",
        {
          movie_id: Number(movieId),
          movie_name: movie.title,
          content: reviewText,
          rating,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReviews([res.data, ...reviews]);
      setReviewText("");
      setRating(5);
      
      // Refresh user data to show updated credits
      refreshUserData();
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to submit review";
      alert(message);
    }
  };

  // Add to favourites
  const handleAddFavourite = async () => {
  if (!user) return alert("You must be logged in to add to favourites");

  try {
    await addFavourite(movie);
    alert("Added to Favourites!");
    refreshUserData();
  } catch (err) {
    console.error(err);
    alert(err.message || "Failed to add to favourites");
  }
};


  // Like a review
  const handleLike = async (reviewId) => {
    if (!user) return; // guests cannot vote
    try {
      const res = await fetch(`/api/reviews/${reviewId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) return alert(data.error || "Failed to vote");

      setVotes((prev) => ({ ...prev, [reviewId]: data.liked ? "like" : null }));
      fetchReviews();
      
      // Refresh user data to show updated credits
      refreshUserData();
    } catch (err) {
      console.error(err);
      alert("Failed to like review");
    }
  };

  // Dislike a review
  const handleDislike = async (reviewId) => {
    if (!user) return; // guests cannot vote
    try {
      const res = await fetch(`/api/reviews/${reviewId}/dislike`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) return alert(data.error || "Failed to vote");

      setVotes((prev) => ({ ...prev, [reviewId]: data.disliked ? "dislike" : null }));
      fetchReviews();
      
      // Refresh user data to show updated credits
      refreshUserData();
    } catch (err) {
      console.error(err);
      alert("Failed to dislike review");
    }
  };

  return (
    <div className="movie-page">
      {/* Movie Info */}
      <div className="movie-box">
        <div className="movie-info-wrapper">
          <img
            className="movie-poster"
            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
            alt={`${movie.title} poster`}
          />
          <div className="movie-details">
            <h2>{movie.title}</h2>
            <p><strong>Release Year:</strong> {movie.release_date?.split("-")[0]}</p>
            <p>{movie.overview}</p>
            <div className="movie-actions">
              <button className="btn-white" onClick={handleAddFavourite}>❤️ Add to Favorites</button>
              <AddToListButton movie={movie} /> {/* Popup window for "Add to List" */}
              <button className="btn-white">🔗 Share</button>
            </div>
          </div>
        </div>
      </div>

      {/* Write Review */}
      {user && (
        <div className="movie-box">
          <h3>Write a Review</h3>
          <form onSubmit={handleSubmit}>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              {[1, 2, 3, 4, 5].map((n) => (
                <option value={n} key={n}>{'⭐'.repeat(n)}</option>
              ))}
            </select>
            <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} rows="3" />
            <button type="submit">Submit</button>
          </form>
        </div>
      )}

      {/* Reviews */}
      <div className="movie-box">
        <h3>User Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet</p>
        ) : (
          <ul className="reviews-list">
            {reviews.map((r) => (
              <li key={r.id} className="review-card">
                {/* Avatar */}
                <div className="review-avatar">
                  {avatarCache[r.user_id]?.length ? (
                    avatarCache[r.user_id].map((layer, i) => (
                      <img
                        key={i}
                        className="avatar-layer"
                        style={{ zIndex: layer.layer_index }}
                        src={layer.image_url}
                      />
                    ))
                  ) : (
                    <div className="avatar-placeholder">?</div>
                  )}
                </div>

                {/* Review Content */}
                <div className="review-content">
                  <strong>{r.username}</strong> {"⭐".repeat(r.rating)}
                  <p>{r.content}</p>
                  <small>{new Date(r.created_at).toLocaleDateString()}</small>

                  {/* Like/Dislike buttons */}
                  <div className="review-votes">
                    <button
                      className={`btn-vote ${votes[r.id] === "like" ? "active" : ""}`}
                      onClick={() => user && handleLike(r.id)}
                      disabled={!user || r.user_id === user.id}
                      title={
                        !user
                          ? "Log in to vote"
                          : r.user_id === user.id
                          ? "You cannot vote your own review"
                          : "Like"
                      }
                    >
                      👍 {r.likes ?? 0}
                    </button>

                    <button
                      className={`btn-vote ${votes[r.id] === "dislike" ? "active" : ""}`}
                      onClick={() => user && handleDislike(r.id)}
                      disabled={!user || r.user_id === user.id}
                      title={
                        !user
                          ? "Log in to vote"
                          : r.user_id === user.id
                          ? "You cannot vote your own review"
                          : "Dislike"
                      }
                    >
                      👎 {r.dislikes ?? 0}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
