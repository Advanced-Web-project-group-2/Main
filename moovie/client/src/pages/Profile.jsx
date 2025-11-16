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
        </>
      ) : (
        <p>You must be logged in to view your profile.</p>
      )}
    </section>
  );
}
