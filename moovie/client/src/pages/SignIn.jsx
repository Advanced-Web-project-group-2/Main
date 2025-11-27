import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthCard from "../components/AuthCard";

import cowRead from "../assets/images/Lehmä_login_read.png";
import cowHide from "../assets/images/Lehmä_login_hide.png";

export default function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [cowImg, setCowImg] = useState(cowRead);

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleFocus = () => setCowImg(cowHide);
  const handleBlur = () => setCowImg(cowRead);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) return alert(data.error);

      localStorage.setItem("token", data.token);
      login(data.user.username);

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <AuthCard cowImage={cowImg}>
      <h2>Welcome Back!</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })/*  */
          }
          required
        />

        <br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(e) =>
            setForm({ ...form, [e.target.name]: e.target.value })
          }
          required
        />

        <br />

        <button type="submit" className="btn-primary">Sign In</button>
      </form>

      <p>
        Don’t have an account yet? <Link to="/signup">Create account</Link>
      </p>
    </AuthCard>
  );
}
