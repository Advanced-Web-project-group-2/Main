import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";

import cowWrite from "../assets/images/Lehmä_login_writing.png";
import cowHide from "../assets/images/Lehmä_login_hide.png";

export default function SignUp() {
  const navigate = useNavigate();

  const [cowImg, setCowImg] = useState(cowWrite);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleFocus = () => setCowImg(cowHide);
  const handleBlur = () => setCowImg(cowWrite);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error);

      localStorage.setItem("token", data.token);
      navigate("/signin");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <AuthCard cowImage={cowImg}>
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, [e.target.name]: e.target.value })
          }
          required
        />

        <br />

        <button type="submit" className="btn-primary">Create Account</button>
      </form>

      <p>
        Already have an account? <Link to="/signin">Sign in</Link>
      </p>
    </AuthCard>
  );
}
