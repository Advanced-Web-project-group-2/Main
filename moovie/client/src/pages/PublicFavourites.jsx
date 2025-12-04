import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function PublicFavourites() {
  const { userId } = useParams();
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicFavourites = async () => {
      try {

        const res = await fetch(
          `http://localhost:5000/api/lists/favorites/public/${userId}`
        );

        const data = await res.json();
        setFavourites(data.favourites || []);
      } catch (err) {
        console.error("Error fetching public favourites:", err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchPublicFavourites();
  }, [userId]);

  if (loading) return <p>Loading favourites...</p>;

  return (
    <div className="public-favourites">
      <h2>Shared Favourite Movies</h2>
      {favourites.length ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {favourites.map((movie) => (
            <li key={movie.id} style={{ display: "flex", marginBottom: "8px" }}>
              <Link to={`/movie/${movie.id}`}>
                <img
                  src={movie.poster_url || "https://via.placeholder.com/60x90"}
                  alt={movie.name}
                  style={{ width: "60px", borderRadius: "6px", marginRight: "10px" }}
                />
              </Link>
              <span>
                {movie.name} {movie.release_year && `(${movie.release_year})`}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No favourites found.</p>
      )}
    </div>
  );
}
