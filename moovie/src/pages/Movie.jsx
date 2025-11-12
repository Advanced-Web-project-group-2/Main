
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // for dynamic movieId in URL
import { Link } from "react-router-dom";
import axios from "axios";

export default function Movie() {
  const { movieId } = useParams(); // movieId comes from route like /movie/:movieId
  const [movie, setMovie] = useState(null);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US`
        );
        setMovie(response.data);
      } catch (error) {
        console.error("Error fetching movie:", error);
      }
    };

    fetchMovie();
  }, [movieId]);

  if (!movie) return <p>Loading...</p>;

  return (
    <div>
      <header>
        <h1>{movie.title}</h1>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/groups">Groups</Link></li>
            <li><Link to="/in-cinemas">In Cinemas</Link></li>
            <li><Link to="/advanced-search">Advanced Search</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/signup">Sign up</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        <section id="movie-info">
          <h2>{movie.title}</h2>
          <p><strong>Release Year:</strong> {movie.release_date?.split("-")[0]}</p>
          <p><strong>Description:</strong> {movie.overview}</p>
          <p>
            <strong>Genres:</strong>{" "}
            {movie.genres.map((g) => g.name).join(", ")}
          </p>

          <div>
            <button>Add to Favorites</button>
            <button>Add to Watchlist</button>
          </div>
        </section>

        <hr />

        <section id="write-review">
          <h3>Write a Review</h3>
          <form>
            <label htmlFor="stars">Rating:</label>
            <select name="stars" id="stars">
              <option value="1">⭐</option>
              <option value="2">⭐⭐</option>
              <option value="3">⭐⭐⭐</option>
              <option value="4">⭐⭐⭐⭐</option>
              <option value="5">⭐⭐⭐⭐⭐</option>
            </select>
            <br />
            <br />
            <textarea
              name="reviewText"
              placeholder="Write your review here..."
              rows="5"
              cols="40"
            />
            <br />
            <br />
            <button type="submit">Submit Review</button>
          </form>
        </section>

        <hr />

        <section id="reviews">
          <h3>User Reviews</h3>
          <ul>
            <li>
              <strong>⭐⭐⭐⭐☆</strong>
              <br />
              Great movie!
              <br />
              <em>By movieFan99, 2025-02-10</em>
            </li>
            <li>
              <strong>⭐⭐⭐☆☆</strong>
              <br />
              Boring story, good actors.
              <br />
              <em>By ActionDude, 2025-02-08</em>
            </li>
          </ul>
        </section>
      </main>

      <footer>
        <p>2025 Moo-viestar</p>
      </footer>
    </div>
  );
}
