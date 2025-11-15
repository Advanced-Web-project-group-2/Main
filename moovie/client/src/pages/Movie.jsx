import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function Movie() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`)
      .then((res) => setMovie(res.data))
      .catch(console.error);
  }, [movieId]);

  if (!movie) return <p>Loading...</p>;

  return (
    <>
      <section id="movie-info">
        <h2>{movie.title}</h2>
        <p><strong>Release Year:</strong> {movie.release_date?.split("-")[0]}</p>
        <p>{movie.overview}</p>

        <p><strong>Genres:</strong> {movie.genres.map((g) => g.name).join(", ")}</p>

        <button>Add to Favorites</button>
        <button>Add to List</button>
      </section>

      <hr />

      <section id="write-review">
        <h3>Write a Review</h3>
        <textarea rows="4" placeholder="Write your review..." />
        <br />
        <button>Submit Review</button>
      </section>
    </>
  );
}
