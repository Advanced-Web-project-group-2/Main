// server/src/routes/users.routes.js
import { Router } from "express";
import {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../controllers/users.controller.js";
import authMiddleware from "../middleware/auth.js";
import pool from "../db.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management (admin/developer utility endpoints)
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (admin/dev use)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Returns all users
 *       500:
 *         description: Server error
 */
router.get("/", getAllUsers);

/**
 * @swagger
 * /users/add:
 *   post:
 *     summary: Add a new user (dev/admin only)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - passhash
 *             properties:
 *               username:
 *                 type: string
 *               passhash:
 *                 type: string
 *               credits:
 *                 type: number
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
router.post("/add", addUser);

/**
 * @swagger
 * /users/update/{id}:
 *   put:
 *     summary: Update a user's username or password hash
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               passhash:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *       400:
 *         description: No update fields provided
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put("/update/:id", updateUser);

/**
 * @swagger
 * /users/delete:
 *   delete:
 *     summary: Delete authenticated user's account
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete("/delete", authMiddleware, deleteUser);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to fetch profile
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, credits FROM users WHERE id = $1",
      [req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("GET /users/me ERROR:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default router;
