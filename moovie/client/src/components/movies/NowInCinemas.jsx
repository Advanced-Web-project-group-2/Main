
import { useEffect, useState } from 'react';

export default function NowInCinemas() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Fetch from Node server
    fetch('/api/now-playing')
      .then(res => res.json())
      .then(data => {

        //Take top 3 movies
        setMovies(data.results.slice(0, 3));
      })
      .catch(err => console.error('Error fetching movies:', err));
  }, []);

  return (
    <div>
      <h2>Top 3 Now in Cinemas</h2>
      <ul>
        {movies.map(movie => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </div>
  );
}
