import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const refreshUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);

        localStorage.setItem("username", updatedUser.username);
        localStorage.setItem("userId", updatedUser.id);
        localStorage.setItem("credits", updatedUser.credits);
      }
    } catch (err) {
      console.error("Failed to refresh user data:", err);
    }
  };

  const login = async (username, token, id = null, credits = 0) => {
    if (token) localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    if (id) localStorage.setItem("userId", id);
    if (credits !== undefined) localStorage.setItem("credits", credits);

    setUser({ username, id, credits });

    await refreshUserData();
  };

  const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("credits");
    setUser(null);
  };

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
