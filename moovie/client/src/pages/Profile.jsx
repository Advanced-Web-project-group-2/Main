import { useState } from "react";
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

  /* const handleDeleteAccount = async () => {
    console.log("Delete button clicked");

    // Step 1: Confirm delete
    const confirmed = window.confirm("Are you sure you want to delete your account?");
    if (!confirmed) return;

    // Step 2: Ask for password (safety)
    const password = window.prompt("Please enter your password to confirm:");
    if (!password) {
      alert("Password is required to delete the account.")
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found, please log in again.");
      return;
    }

    try {
      console.log("Sending delete request with password(length):", password.length);

      const res = await fetch("http://localhost:5000/auth/delete", {   
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      let data = null;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }

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
  }; */

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletePassword) {
      alert("Password is required.");
      return;
    }

    const token = localStorage.getItem("token");

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


  return (
    <section>

      <h2>Profile</h2>

      {user ? (
        <>
          <p>Logged in as: <strong>{user.username}</strong></p>

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

          <button
            className="delete-account-btn"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>

        </>
      ) : (
        <p>You must be logged in to view your profile.</p>
      )}

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

    </section>
  );
}
