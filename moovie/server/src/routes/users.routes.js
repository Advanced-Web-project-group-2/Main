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

// Public / admin utility endpoints

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management (admin/dev tools)
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
 */

router.get("/", getAllUsers);

/**
 * @swagger
 * /users/add:
 *   post:
 *     summary: Add a new user (dev/admin use)
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
 */

router.post("/add", addUser);

// Authenticated ones

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
 *           format: uuid
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
 *       404:
 *         description: User not found
 */

router.put("/update/:id", updateUser);

/**
 * @swagger
 * /users/delete:
 *   delete:
 *     summary: Delete the authenticated user's account
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
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
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 username:
 *                   type: string
 *                 credits:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to fetch user
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

