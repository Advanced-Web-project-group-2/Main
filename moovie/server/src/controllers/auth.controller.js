// server/src/controllers/auth.controller.js
import pool from "../db.js";
import bcrypt from "bcrypt";
import { generateToken } from "../services/jwt.service.js";

function validatePassword(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password);

  if (password.length < minLength) {
    return false;
  }

  if (!hasLowerCase) {
    return false
  }

  if (!hasUpperCase) {
    return false;
  }

  if (!hasNumber) {
    return false
  }

  return true;
}

// POST /auth/register
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Username, email and password required" });
    }

    // Check if email is taken
    const emailCheck = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Check if username is taken
    const userCheck = await pool.query("SELECT id FROM users WHERE username = $1", [username]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: "Username already taken" });
    }

    // Simple email validation (can be improved)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (!validatePassword(password)) {
      return res.status(403).json({ error: "Password does not fill requirements" });
    }

    const passhash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (username, email, passhash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, credits, created_at`,
      [username, email, passhash]
    );

    const user = result.rows[0];
    const token = generateToken(user);

    // Default inventory icons
    await pool.query(
      `INSERT INTO user_items (user_id, item_id)
       SELECT $1, id FROM shop WHERE name IN ('Black & White Basic', 'Brown Basic')`,
      [user.id]
    );

    // Create default Favourites list
    await pool.query("INSERT INTO lists (owner_id, name) VALUES ($1, 'Favourites')", [user.id]);

    res.status(201).json({
      message: "User created",
      token,
      user,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const userRes = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (userRes.rows.length === 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const user = userRes.rows[0];
    const isMatch = await bcrypt.compare(password, user.passhash);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

    const token = generateToken(user);

    res.json({
      message: "Logged in",
      token,
      user: { id: user.id, username: user.username, email: user.email, credits: user.credits },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


// PUT /auth/change-password
export async function changePassword(req, res) {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ error: "Old and new password required" });
  }

  try {
    const result = await pool.query(
      "SELECT passhash FROM users WHERE id = $1",
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];

    const match = await bcrypt.compare(oldPassword, user.passhash);
    if (!match) {
      return res.status(401).json({ error: "Old password incorrect" });
    }

    if (!validatePassword(newPassword)) {
      return res.status(403).json({ error: "Password does not fill requirements" });
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE users SET passhash = $1 WHERE id = $2",
      [newHash, userId]
    );

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Password change error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// DELETE /auth/delete
export const deleteAccount = async (req, res) => {
  // account deletion requested

  const userId = req.user.id;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  try {
    // 1. Fetch user
    const result = await pool.query("SELECT passhash FROM users WHERE id = $1", [userId]);



    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];

    // 2. Compare provided password with hashed password
    const match = await bcrypt.compare(password, user.passhash);
    if (!match) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // 3. Delete user
    const deleteResult = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id, username", [userId]);

    res.json({
      message: "Account deleted successfully",
      deleted: deleteResult.rows[0],
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
