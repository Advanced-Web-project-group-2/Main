import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PublicFavourites() {
  const { userId } = useParams();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPublicList() {
      try {
        const res = await fetch(`http://localhost:5000/lists/favourites/public/${userId}`);
        const data = await res.json();
        setList(data.favourites || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPublicList();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (list.length === 0) return <p>No favourites found</p>;

  return (
    <div className="home-card" style={{ textAlign: "center" }}>
      <h2>Public Favourite Movies</h2>
      <ul>
        {list.map((movie) => (
          <li key={movie.id}>
            <img
              src={movie.poster_url || "https://via.placeholder.com/80x120"}
              style={{ width: "80px", borderRadius: "6px" }}
            />
            <p>{movie.name} ({movie.release_year})</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
