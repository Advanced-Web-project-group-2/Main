import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../styles/CustomList.css";

export default function CustomList() {
  const { listId } = useParams();
  const navigate = useNavigate();
  const [listInfo, setListInfo] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchList = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [listRes, moviesRes] = await Promise.all([
          fetch(`/api/lists`, { headers }),
          fetch(`/api/lists/${listId}`, { headers }),
        ]);

        if (!moviesRes.ok) {
          setError("Could not load list.");
          setLoading(false);
          return;
        }

        const listsJson = await listRes.json();
        const moviesJson = await moviesRes.json();

        const foundList = (listsJson.lists || []).find(
          (l) => String(l.id) === String(listId)
        );

        setListInfo(foundList || null);
        setMovies(moviesJson.movies || []);
      } catch (err) {
        console.error(err);
        setError("Server error while loading the list.");
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [listId]);

  if (loading) return <div className="custom-list-wrapper"><p>Loading list...</p></div>;
  if (error) return <div className="custom-list-wrapper"><p>{error}</p></div>;

  return (
    <div className="custom-list-wrapper">
      <div className="custom-list-card">
        <h2 className="custom-list-title">{listInfo?.name || "Movie List"}</h2>
        {listInfo?.description && (
          <p className="custom-list-description">{listInfo.description}</p>
        )}

        {movies.length === 0 ? (
          <p className="custom-list-empty">No movies in this list yet.</p>
        ) : (
          <ul className="custom-list-movies">
            {movies.map((movie) => (
              <li key={movie.id}>
                <button
                  className="custom-list-movie-row"
                  onClick={() => navigate(`/movie/${movie.id}`)}
                >
                  <img
                    src={
                      movie.poster_url ||
                      (movie.poster_path
                        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                        : "https://via.placeholder.com/80x120?text=No+Poster")
                    }
                    alt={movie.name}
                    className="custom-list-poster"
                    loading="lazy"
                  />
                  <div className="custom-list-movie-info">
                    <span className="custom-list-movie-title">{movie.name}</span>
                    {movie.release_year && (
                      <span className="custom-list-movie-year">
                        ({movie.release_year})
                      </span>
                    )}
                    {movie.genre && (
                      <span className="custom-list-movie-genre">{movie.genre}</span>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="custom-list-footer">
          <button
            className="custom-list-back-btn"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
