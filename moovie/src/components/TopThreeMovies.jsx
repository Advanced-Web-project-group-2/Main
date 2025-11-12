import { useEffect, useState } from 'react';

export default function TopThreeMovies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/now-playing')
      .then(res => res.json())
      .then(data => setMovies(data.results.slice(0, 3)))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Top 3 Now in Cinemas</h2>
      <ul>
        {movies.map(movie => (
          <li key={movie.id}>
            <h3>{movie.title}</h3>
            {movie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
