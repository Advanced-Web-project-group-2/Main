import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function TopThreeMovies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch('/api/now-playing')
      .then(res => res.json())
      .then(data => setMovies(data.results.slice(0, 5)))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="top-three">
      <h2> Top 5 Now in Cinemas</h2>
      <ul className="top-three-list">
        {movies.map((movie) => (
          <li key={movie.id} className="top-three-item">
            <Link to={`/movie/${movie.id}`} className="top-movie-card">
              <div className="top-movie-image-wrapper">
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                      : 'https://via.placeholder.com/200x300?text=No+Image'
                  }
                  alt={movie.title}
                />
              </div>

              <div className="top-movie-title">
                <h3>{movie.title}</h3>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

