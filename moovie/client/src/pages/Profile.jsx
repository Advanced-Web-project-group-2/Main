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

  // 🧩 NEW: Store equipped avatar items
  const [equippedItems, setEquippedItems] = useState([]);

  // Handle password fields
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Change password
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
          Authorization: `Bearer ${token}`,
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
  const confirmDelete = async () => {
    if (!deletePassword) return alert("Please enter password.");

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
      if (!res.ok) return alert(data.error || "Failed to delete account");

      alert("Account deleted.");
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Server error.");
    }
  };

  // Equip icon (single selection)
  const equipIcon = async (itemId) => {
    try {
      await fetch(`http://localhost:5000/shop/equip/icon/${itemId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      refreshShopData();
    } catch (err) {
      console.error("Equip icon failed:", err);
    }
  };

  // Toggle accessory (multiple allowed)
  const toggleAccessory = async (itemId) => {
    try {
      await fetch(`http://localhost:5000/shop/equip/accessory/${itemId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      refreshShopData();
    } catch (err) {
      console.error("Toggle accessory failed:", err);
    }
  };

  // Refresh icons, accessories & avatar
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

  // Fetch favourite movies
  const fetchFavourites = async () => {
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

  // Initial data load
  useEffect(() => {
    if (user) {
      refreshShopData();
      fetchFavourites();
    }
  }, [user]);

  if (!user) return <p>You must be logged in to view your profile.</p>;

  return (
    <div className="profile-grid">

      {/* 🧍 HEADER WITH AVATAR */}
      <div className="profile-box user-header-box">
        <div className="avatar-preview">
          {equippedItems.length > 0 ? (
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
          <p><strong>Credits:</strong> {user.credits}</p>
        </div>

        <div className="profile-settings">
          <button className="btn-blue" onClick={() => setShowChangePw(!showChangePw)}>
            {showChangePw ? "Cancel" : "Change Password"}
          </button>
          <button className="btn-yellow" onClick={() => setShowDeleteModal(true)}>
            Delete Account
          </button>
        </div>
      </div>

      {/* 🔒 Password Change Modal */}
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

      {/* ❌ Delete Account Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Confirm Account Deletion</h3>
            <input type="password" placeholder="Enter password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} />
            <button onClick={confirmDelete}>Delete</button>
            <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* 🎨 Accessories Section */}
      <div className="profile-box box5">
        <h3>Your Accessories</h3>
        <div className="item-grid">
          {accessories.map((a) => (
            <img
              key={a.item_id}
              src={a.image_url}
              alt={a.name}
              className={`profile-item-icon ${a.is_equipped ? "equipped" : ""}`}
              onClick={() => toggleAccessory(a.item_id)}
              title={a.is_equipped ? "Click to unequip" : "Click to equip"}
            />
          ))}
        </div>
      </div>

      {/* 🧾 Lists Section */}
      <div className="profile-box box3">
        <h3>Your Movie Lists</h3>
        <h4>Favourites</h4>
        {favourites.length ? (
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
        {shareUrl && <p>Share: <a href={shareUrl}>{shareUrl}</a></p>}
      </div>

      {/* 🧿 Icons Section */}
      <div className="profile-box box4">
        <h3>Your Icons</h3>
        <div className="item-grid">
          {icons.map((i) => (
            <img
              key={i.item_id}
              src={i.image_url}
              alt={i.name}
              className={`profile-item-icon ${i.is_equipped ? "equipped" : ""}`}
              onClick={() => equipIcon(i.item_id)}
              title={i.is_equipped ? "Equipped" : "Click to equip"}
            />
          ))}
        </div>
      </div>

      <div className="profile-box box2">
        <h3>Your Groups</h3>
      </div>

    </div>
  );
}
