import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function InCinemas() {
  const [movies, setMovies] = useState([]);
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`)
      .then(res => setMovies(res.data.results))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <section id="cinema-list">
        <h2>All Movies in Cinemas</h2>

        <ul>
          {movies.length === 0 ? (
            <p>Loading movies...</p>
          ) : (
            movies.map(movie => (
              <li key={movie.id}>
                <h3>{movie.title}</h3>
                <p>Release date: {movie.release_date}</p>
                {movie.poster_path && (
                  <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} />
                )}
                <br />
                <Link to={`/movie/${movie.id}`}>See Details</Link>
              </li>
            ))
          )}
        </ul>
      </section>
    </>
  );
}
