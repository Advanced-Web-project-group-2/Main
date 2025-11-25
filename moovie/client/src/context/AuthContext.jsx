// client/src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // 🔁 Fetch logged user data (credits, username, id, etc.)
  const refreshUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);

        // Optional: sync for continuity
        localStorage.setItem("username", updatedUser.username);
        localStorage.setItem("userId", updatedUser.id);
        localStorage.setItem("credits", updatedUser.credits);
      }
    } catch (err) {
      console.error("Failed to refresh user data:", err);
    }
  };

  // 🔓 Login — ensure UI updates IMMEDIATELY before backend request
  const login = async (username, token) => {
    if (token) localStorage.setItem("token", token);
    localStorage.setItem("username", username);

    // 👇 This makes the top bar update *instantly*
    setUser((prev) => ({ ...prev, username }));

    // Then in background, fetch credits and id from backend
    await refreshUserData();
  };

  // 🔒 Logout
  const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("credits");
    setUser(null);
  };

  // Load user data when app starts
  useEffect(() => {
    refreshUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
