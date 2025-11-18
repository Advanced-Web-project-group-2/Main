import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

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

  const token = localStorage.getItem("token");

  // Password Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

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

  // Favourites list 
  const fetchFavourites = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/lists/favourites", {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      const data = await res.json();
      console.log("Favourites data:", data);
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

  useEffect(() => {
    if (user) fetchFavourites();
  }, [user]);

  return (
    <section>
      <h2>Profile</h2>

      {user ? (
        <>
          <p>Logged in as: <strong>{user.username}</strong></p>

          {/* Password change */}
          <button
            className="change-password-btn"
            onClick={() => setShowChangePw(!showChangePw)}
          >
            {showChangePw ? "Cancel" : "Change Password"}
          </button>

          {showChangePw && (
            <form
              className="change-password-form"
              onSubmit={handlePasswordChange}
            >
              <input
                type="password"
                name="oldPassword"
                placeholder="Old password"
                required
                value={form.oldPassword}
                onChange={handleChange}
              />

              <input
                type="password"
                name="newPassword"
                placeholder="New password"
                required
                value={form.newPassword}
                onChange={handleChange}
              />

              <input
                type="password"
                name="repeatPassword"
                placeholder="Repeat new password"
                required
                value={form.repeatPassword}
                onChange={handleChange}
              />

              <button type="submit">Update Password</button>
            </form>
          )}

          {/* Favourites list */}
          <h3>Favourites</h3>
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
              Share your favourites list: <a href={shareUrl} target="_blank" rel="noreferrer">{shareUrl}</a>
            </p>
          )}

          {/* Delete account */}
          <button
            className="delete-account-btn"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
          {showDeleteModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>Confirm Account Deletion</h3>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                />
                <div className="modal-buttons">
                  <button onClick={confirmDelete}>Delete</button>
                  <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <p>You must be logged in to view your profile.</p>
      )}
    </section>
  );
}
