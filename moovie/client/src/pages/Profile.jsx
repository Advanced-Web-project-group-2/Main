import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Profile.css";

export default function Profile() {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const [showChangePw, setShowChangePw] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    repeatPassword: "",
  });

  const [favourites, setFavourites] = useState([]);
  const [shareUrl, setShareUrl] = useState("");

  const [icons, setIcons] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [equippedItems, setEquippedItems] = useState([]);

  const [customLists, setCustomLists] = useState([]);
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");

  // HANDLE FORMS
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // PASSWORD CHANGE
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.repeatPassword)
      return alert("New passwords do not match");

    try {
      const res = await fetch("http://localhost:5000/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: form.oldPassword,
          newPassword: form.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error);

      alert("Password updated!");
      setForm({ oldPassword: "", newPassword: "", repeatPassword: "" });
      setShowChangePw(false);
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // DELETE ACCOUNT
  const confirmDelete = async () => {
    if (!deletePassword) return alert("Enter password first");

    try {
      const res = await fetch("http://localhost:5000/auth/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: deletePassword }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error);

      alert("Account deleted");
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // ICONS & ACCESSORIES
  const equipIcon = async (itemId) => {
    await fetch(`http://localhost:5000/shop/equip/icon/${itemId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    refreshShopData();
  };

  const toggleAccessory = async (itemId) => {
    await fetch(`http://localhost:5000/shop/equip/accessory/${itemId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    refreshShopData();
  };

  const refreshShopData = async () => {
    try {
      const [iconsRes, accessoriesRes, equippedRes] = await Promise.all([
        fetch("http://localhost:5000/shop/user-items/icons", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/shop/user-items/accessories", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/shop/equipped", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setIcons((await iconsRes.json()).items || []);
      setAccessories((await accessoriesRes.json()).items || []);
      setEquippedItems((await equippedRes.json()).equipped || []);
    } catch (err) {
      console.error(err);
    }
  };

  // FAVORITES
  const removeFavourite = async (movieId) => {
    try {
      const res = await fetch(`/api/lists/favourites`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ movieId }),
      });

      if (!res.ok) return alert("Failed to remove movie");
      setFavourites((prev) => prev.filter((m) => m.id !== movieId));
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const fetchFavourites = async () => {
    try {
      const res = await fetch(`/api/lists/favourites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFavourites(data.favourites || []);
      setShareUrl(
        `${window.location.origin}/lists/favourites/public/${user.id}`
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const handler = () => fetchFavourites();
    window.addEventListener('movieAddedToFavourites', handler);
    return () => window.removeEventListener('movieAddedToFavourites', handler);
  }, []);

  // CUSTOM LISTS
  const fetchCustomLists = async () => {
    try {
      const res = await fetch(`/api/lists`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCustomLists(data.lists || []);
    } catch (err) {
      console.error(err);
    }
  };

  const createNewList = async () => {
    if (!newListName.trim()) return alert("List name is required");

    try {
      const res = await fetch(`/api/lists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newListName,
          description: newListDescription,
        }),
      });

      const data = await res.json();

      if (!res.ok) return alert(data.error);

      setCustomLists((prev) => [...prev, data.list]);
      setNewListName("");
      setNewListDescription("");
    } catch (err) {
      console.error(err);
    }
  };

  // LOAD ALL DATA
  useEffect(() => {
    if (user) {
      refreshShopData();
      fetchFavourites();
      fetchCustomLists();
    }
  }, [user]);

  if (!user) return <p>You must be logged in to view your profile.</p>;

  return (
    <div className="profile-grid">
      {/* TOP PROFILE BOX */}
      <div className="profile-box user-header-box">
        <div className="avatar-preview">
          {equippedItems.length ? (
            equippedItems.map((item) => (
              <img
                key={item.item_id}
                src={item.image_url}
                alt={item.name}
                className="avatar-layer"
                style={{ zIndex: item.layer_index }}
              />
            ))
          ) : (
            <p>No avatar</p>
          )}
        </div>

        <div className="profile-main-info">
          <h2>{user.username}</h2>
          <p>
            <strong>Credits:</strong> {user.credits}
          </p>
        </div>

        <div className="profile-settings">
          <button
            className="btn-blue"
            onClick={() => setShowChangePw(true)}
          >
            Change Password
          </button>
          <button
            className="btn-yellow"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* FAVOURITES */}
      <div className="profile-box box2">
        <h3>Favourite Movies</h3>
        {favourites.length ? (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {favourites.map((movie) => (
              <li key={movie.id} style={{ display: "flex", marginBottom: "8px" }}>
                <img
                  src={movie.poster_url || "https://via.placeholder.com/60x90"}
                  alt={movie.name}
                  style={{ width: "60px", borderRadius: "6px", marginRight: "10px" }}
                />
                <span>{movie.name} {movie.release_year && `(${movie.release_year})`}</span>
                <button
                  className="remove-fav-btn"
                  onClick={() => removeFavourite(movie.id)}
                  title="Remove from favorites"
                >
                  <span className="heart-icon">💔</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No favourites yet.</p>
        )}
        {shareUrl && (
          <div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                alert("Share link copied to clipboard!");
              }}
              className="btn-primary"
            >
              Share 󰒗
            </button>
          </div>
        )}
      </div>

      {/* CUSTOM LISTS */}
      <div className="profile-box box3">
        <h3>Your Custom Lists</h3>
        <input
          type="text"
          placeholder="New list name"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
        />
        <textarea
          placeholder="Description (optional)"
          value={newListDescription}
          onChange={(e) => setNewListDescription(e.target.value)}
        />
        <button onClick={createNewList}>Create List</button>

        {customLists.length ? (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {customLists.map((list) => (
              <li key={list.id} style={{ marginBottom: "6px" }}>
                <strong>{list.name}</strong>
                {list.description && <small> – {list.description}</small>}
              </li>
            ))}
          </ul>
        ) : (
          <p>No custom lists yet.</p>
        )}
      </div>

      {/* SIDEBAR: ICONS + ACCESSORIES */}
      <div className="profile-box box5">
        <h3>Your Icons</h3>
        <div className="item-grid">
          {icons.map((i) => (
            <img
              key={i.item_id}
              src={i.image_url}
              alt={i.name}
              className={`profile-item-icon ${i.is_equipped ? "equipped" : ""}`}
              onClick={() => equipIcon(i.item_id)}
            />
          ))}
        </div>

        <hr style={{ margin: "12px 0", border: "2px solid black" }} />

        <h3>Your Accessories</h3>
        <div className="item-grid">
          {accessories.map((a) => (
            <img
              key={a.item_id}
              src={a.image_url}
              alt={a.name}
              className={`profile-item-icon ${a.is_equipped ? "equipped" : ""}`}
              onClick={() => toggleAccessory(a.item_id)}
            />
          ))}
        </div>
      </div>
      {/* MODALS */}
      {showChangePw && (
        <div className="modal-overlay" onClick={() => setShowChangePw(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Change Password</h3>
            <form className="password-form" onSubmit={handlePasswordChange}>
              <input
                type="password"
                name="oldPassword"
                placeholder="Current password"
                value={form.oldPassword}
                onChange={handleChange}
              />
              <input
                type="password"
                name="newPassword"
                placeholder="New password"
                value={form.newPassword}
                onChange={handleChange}
              />
              <input
                type="password"
                name="repeatPassword"
                placeholder="Repeat new password"
                value={form.repeatPassword}
                onChange={handleChange}
              />
              <div style={{ display: "flex", gap: 10 }}>
                <button type="submit" className="btn-blue">Save</button>
                <button
                  type="button"
                  className="btn-yellow"
                  onClick={() => {
                    setForm({ oldPassword: "", newPassword: "", repeatPassword: "" });
                    setShowChangePw(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Account Deletion</h3>
            <p>Enter your password to permanently delete your account.</p>
            <input
              type="password"
              placeholder="Password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
            />
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <button className="btn-yellow" onClick={confirmDelete}>
                Delete
              </button>
              <button className="btn-blue" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
