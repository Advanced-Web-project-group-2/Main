// server/src/controllers/auth.controller.js
import pool from "../db.js";
import bcrypt from "bcrypt";
import { generateToken } from "../services/jwt.service.js";

// POST /auth/register
export const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password required" });
    }

    const userCheck = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const passhash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (username, passhash)
       VALUES ($1, $2)
       RETURNING id, username, credits, icon, created_at`,
      [username, passhash]
    );

    const user = result.rows[0];
    const token = generateToken(user);

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
    const { username, password } = req.body;

    if (!username || !password)
      return res
        .status(400)
        .json({ error: "Username and password required" });

    const userRes = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (userRes.rows.length === 0) {
      return res
        .status(400)
        .json({ error: "Invalid username or password" });
    }

    const user = userRes.rows[0];

    const isMatch = await bcrypt.compare(password, user.passhash);
    if (!isMatch) {
      return res
        .status(400)
        .json({ error: "Invalid username or password" });
    }

    const token = generateToken(user);

    res.json({
      message: "Logged in",
      token,
      user: {
        id: user.id,
        username: user.username,
        credits: user.credits,
        icon: user.icon,
      },
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
  try {
    const userId = req.user.id;
    const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [userId]);


    if (result.rowCount == 0) {
      return res.status(404).json({ error: "User not found or already deleted" });
    }

    res.json({ message: "Account deleted successfully", deletedUser: result.rows[0] });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
