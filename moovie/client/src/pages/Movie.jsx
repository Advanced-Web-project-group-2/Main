import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Movie() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [avgRating, setAvgRating] = useState(0)

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  // Fetch movie from TMDB
  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`)
      .then((res) => setMovie(res.data))
      .catch(console.error);
  }, [movieId]);

  // Function to render stars from a numeric rating
  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    return "⭐".repeat(full) + (half ? "✬" : "") + "☆".repeat(empty);
  };

  // Fetch reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/reviews/${movieId}`
        );
        setReviews(res.data.reviews);
        setAvgRating(res.data.avgRating);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      }
    };
    fetchReviews();
  }, [movieId]);

  // Recalculate average rating anytime reviews change
  useEffect(() => {
    if (reviews.length === 0) {
      setAvgRating(0);
      return;
    }
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    setAvgRating(sum / reviews.length);
  }, [reviews]);

  if (!movie) return <p>Loading...</p>;

  // Submit a new review
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if (!token) {
      return alert("You must be logged in to submit a review");
    }

    // Check if user already reviewed this movie
    if (reviews.some(r => r.user_id === localStorage.getItem("userId"))) {
      return alert("You have already reviewed this movie");
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/reviews",
        {
          movie_id: Number(movieId),    
          movie_name: movie.title,      
          content: reviewText,          
          rating: rating,               
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Add new review
    const newReview = { ...res.data, username };
    setReviews([newReview, ...reviews]);
    setReviewText("");
    setRating(5);
    } catch (err) {
      console.error("Error submitting review:", err.response?.data);
      alert(err.response?.data?.error || "Failed to add review");
    }
  };

  // Add to favourites
  const handleAddToFavourites = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token) {
      return alert("You must be logged in to add favourites");
    }

    try {
      await axios.post(
        "http://localhost:5000/api/lists/favourites",
        {
          movieId: Number(movieId),
          movie_name: movie.title,
          genre: movie.genres.map((g) => g.name).join(", "),
          release_year: movie.release_date?.split("-")[0],
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(`${movie.title} added to favourites!`);
    } catch (err) {
      console.error("Error adding to favourites:", err.response?.data);
      alert(err.response?.data?.error || "Failed to add to favourites");
    }
  };

  return (
    <>
      <section id="movie-info">
        <h2>{movie.title}</h2>
        <p>
          <strong>Release Year:</strong>{" "}
          {movie.release_date?.split("-")[0]}
        </p>
        <p>{movie.overview}</p>
        <p>
          <strong>Genres:</strong>{" "}
          {movie.genres.map((g) => g.name).join(", ")}
        </p>

        <button onClick={handleAddToFavourites}>Add to Favourites</button>
        <button>Add to List</button>
      </section>

      <hr />

      <section id="write-review">
        <h3>Write a Review</h3>
        <form onSubmit={handleSubmit}>
          <label>Rating:</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            <option value={1}>⭐</option>
            <option value={2}>⭐⭐</option>
            <option value={3}>⭐⭐⭐</option>
            <option value={4}>⭐⭐⭐⭐</option>
            <option value={5}>⭐⭐⭐⭐⭐</option>
          </select>
          <br />

          <textarea
            rows="4"
            placeholder="Write your review..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
          <br />

          <button type="submit">Submit Review</button>
        </form>
      </section>

      <hr />

      <section id="reviews">
        <h3>User Reviews</h3>

        {reviews.length === 0 ? (
          <p>No reviews yet</p>
        ) : (
          <ul>
            {reviews.map((r) => (
              <li key={r.id}>
                <strong>{r.username}</strong>{" "}
                {Array(r.rating)
                  .fill("⭐")
                  .join("")}
                <br />
                {r.content}
                <br />
                <em>{new Date(r.created_at).toLocaleDateString()}</em>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="average-rating">
        <h3>Average Rating</h3>
        {reviews.length === 0 ? (
          <p>No ratings yet</p>
        ) : (
          <p>
            {renderStars(avgRating)} ({avgRating.toFixed(1)})
          </p>
        )}
      </section>

    </>
  );
}

