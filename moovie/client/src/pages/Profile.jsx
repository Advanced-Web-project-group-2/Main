import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Profile.css";

export default function Profile() {
  const { user } = useAuth();

  // Change password form (your original logic)
  const [showChangePw, setShowChangePw] = useState(false);
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    repeatPassword: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account?"
    );
    if (!confirmed) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/auth/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      const contentType = res.headers.get("content-type");
      const data = contentType?.includes("application/json") ? await res.json() : null;

      if (!res.ok) {
        return alert((data && data.error) || "Failed to delete account.");
      }

      alert("Account deleted successfully.");
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (err) {
      console.error("Delete error:", err);
      alert("Server error. Please try again later.");
    }
  };

  // -----------------------------
  // Fetch User Items
  // -----------------------------
  const [icons, setIcons] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const token = localStorage.getItem("token");

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

  if (!user) return <p>You must be logged in to view your profile.</p>;

  return (
    <div className="profile-grid">

      {/* BOX 1 — User Header */}
      <div className="profile-box user-header-box">

        {/* Left: Avatar */}
        <div className="avatar-preview">
          Avatar Here
        </div>

        {/* Middle: username + credits */}
        <div className="profile-main-info">
          <h2>{user.username}</h2>
          <p><strong>Credits:</strong> {user.credits}</p>
        </div>

        {/* Right: settings (pw + delete) */}
        <div className="profile-settings">
          <button
            className="change-password-btn btn-blue"
            onClick={() => setShowChangePw(!showChangePw)}
          >
            {showChangePw ? "Cancel" : "Change Password"}
          </button>

          {showChangePw && (
  <div className="modal-overlay" onClick={() => setShowChangePw(false)}>
    
    <div className="modal-box" onClick={(e) => e.stopPropagation()}>

      <h2>Change Password</h2>

      <form className="password-form" onSubmit={handlePasswordChange}>
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

        <button type="submit" className="btn-blue">Update Password</button>

        {/* Cancel Button */}
        <button
          type="button"
          className="btn-yellow"
          onClick={() => setShowChangePw(false)}
        >
          Cancel
        </button>
      </form>

    </div>
  </div>
)}


          <button className="delete-account-btn btn-yellow" onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </div>

      </div>

      {/* -------------------------------------- */}
      {/* BOX 5 — Tall Accessory Box */}
      {/* -------------------------------------- */}
      <div className="profile-box box5">
        <h3>Your Accessories</h3>
        <div className="item-grid">
          {accessories.length === 0 ? (
            <p>No accessories yet.</p>
          ) : (
            accessories.map((a) => (
              <img key={a.id} src={a.image_url} alt={a.name} className="profile-item-icon" />
            ))
          )}
        </div>
      </div>

      {/* BOX 2 */}
      <div className="profile-box box2">
        <h3>Your Groups</h3>
        <p>(Coming later)</p>
      </div>

      {/* BOX 3 */}
      <div className="profile-box box3">
        <h3>Your Movie Lists</h3>
        <p>(Coming later)</p>
      </div>

      {/* BOX 4 — Wide icons box */}
      <div className="profile-box box4">
        <h3>Your Icons</h3>
        <div className="item-grid">
          {icons.length === 0 ? (
            <p>No icons yet.</p>
          ) : (
            icons.map((i) => (
              <img key={i.id} src={i.image_url} alt={i.name} className="profile-item-icon" />
            ))
          )}
        </div>
      </div>

    </div>
  );
}
