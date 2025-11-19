import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Profile.css";

export default function Profile() {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const [showChangePw, setShowChangePw] = useState(false);
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    repeatPassword: "",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  const [favourites, setFavourites] = useState([]);
  const [shareUrl, setShareUrl] = useState("");

  const [icons, setIcons] = useState([]);
  const [accessories, setAccessories] = useState([]);

  // Handle password input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle password submit
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.repeatPassword) {
      alert("New passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          oldPassword: form.oldPassword,
          newPassword: form.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error);

      alert("Password updated successfully!");
      setForm({ oldPassword: "", newPassword: "", repeatPassword: "" });
      setShowChangePw(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  // Delete account
  const handleDeleteAccount = () => setShowDeleteModal(true);

  const confirmDelete = async () => {
    if (!deletePassword) {
      alert("Password is required.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/auth/delete", {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: deletePassword }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error || "Delete failed.");

      alert("Account deleted successfully.");
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Server error.");
    }
  };

  // Fetch favourites
  const fetchFavourites = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/lists/favourites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFavourites(data.favourites || []);
      setShareUrl(`${window.location.origin}/lists/favourites/public/${user.id}`);
    } catch (err) {
      console.error("Failed to fetch favourites:", err);
    }
  };

  const removeFavourite = async (movieId) => {
    try {
      const res = await fetch("http://localhost:5000/lists/favourites", {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ movieId }),
      });
      if (!res.ok) return alert("Failed to remove from favourites");
      setFavourites(favourites.filter((m) => m.id !== movieId));
    } catch (err) {
      console.error(err);
      alert("Server error.");
    }
  };

  // Fetch user shop items
  useEffect(() => {
    if (!user) return;

    async function fetchItems() {
      try {
        const res1 = await fetch("http://localhost:5000/shop/user-items/icons", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data1 = await res1.json();
        setIcons(data1.items || []);

        const res2 = await fetch("http://localhost:5000/shop/user-items/accessories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data2 = await res2.json();
        setAccessories(data2.items || []);
      } catch (err) {
        console.error(err);
      }
    }

    fetchItems();
  }, [user]);

  // Fetch lists
  useEffect(() => {
    if (user) fetchFavourites();
  }, [user]);

  if (!user) return <p>You must be logged in to view your profile.</p>;

  return (
    <div className="profile-grid">

      <div className="profile-box user-header-box">
        <div className="profile-main-info">
          <h2>{user.username}</h2>
          <p><strong>Credits:</strong> {user.credits}</p>
        </div>

        <button className="change-password-btn btn-blue" onClick={() => setShowChangePw(!showChangePw)}>
          {showChangePw ? "Cancel" : "Change Password"}
        </button>

        {showChangePw && (
          <div className="modal-overlay" onClick={() => setShowChangePw(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h2>Change Password</h2>
              <form onSubmit={handlePasswordChange}>
                <input type="password" name="oldPassword" placeholder="Old password" value={form.oldPassword} onChange={handleChange} required />
                <input type="password" name="newPassword" placeholder="New password" value={form.newPassword} onChange={handleChange} required />
                <input type="password" name="repeatPassword" placeholder="Repeat new password" value={form.repeatPassword} onChange={handleChange} required />

                <button type="submit" className="btn-blue">Update Password</button>
                <button type="button" className="btn-yellow" onClick={() => setShowChangePw(false)}>Cancel</button>
              </form>
            </div>
          </div>
        )}

        <button className="delete-account-btn btn-yellow" onClick={handleDeleteAccount}>
          Delete Account
        </button>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Account Deletion</h3>
            <input type="password" placeholder="Enter your password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} />
            <button onClick={confirmDelete}>Delete</button>
            <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="profile-box box5">
        <h3>Your Accessories</h3>
        <div className="item-grid">
          {accessories.map((a) => (
            <img key={a.id} src={a.image_url} alt={a.name} className="profile-item-icon" />
          ))}
        </div>
      </div>

      <div className="profile-box box2">
        <h3>Your Groups</h3>
      </div>

      <div className="profile-box box3">
        <h3>Your Movie Lists</h3>

        <h4>Favourites</h4>
        {favourites.length > 0 ? (
          <ul>
            {favourites.map((movie) => (
              <li key={movie.id}>
                {movie.name} ({movie.release_year})
                <button onClick={() => removeFavourite(movie.id)}>Remove</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No favourites yet.</p>
        )}

        {shareUrl && (
          <p>
            Share your favourites list:{" "}
            <a href={shareUrl} target="_blank" rel="noreferrer">{shareUrl}</a>
          </p>
        )}
      </div>

      <div className="profile-box box4">
        <h3>Your Icons</h3>
        <div className="item-grid">
          {icons.map((i) => (
            <img key={i.id} src={i.image_url} alt={i.name} className="profile-item-icon" />
          ))}
        </div>
      </div>

    </div>
  );
}
