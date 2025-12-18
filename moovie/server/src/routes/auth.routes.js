// server/src/routes/auth.routes.js
import express from "express";
import authMiddleware from "../middleware/auth.js";
import { addCredits } from "../controllers/users.controller.js";
import {
  register,
  login,
  changePassword,
  deleteAccount,
} from "../controllers/auth.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication & user account endpoints
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 description: Must contain uppercase, lowercase & number. Minimum 8 chars.
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Missing or invalid fields / username or email already used
 *       403:
 *         description: Password does not meet requirements
 *       500:
 *         description: Internal server error
 */
router.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user (returns a JWT token)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid email or password / missing fields
 *       500:
 *         description: Internal server error
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/protected:
 *   get:
 *     summary: Test JWT authentication
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Access granted
 *       401:
 *         description: Unauthorized or missing token
 */
router.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "You are authenticated!", user: req.user });
});

/**
 * @swagger
 * /auth/change-password:
 *   put:
 *     summary: Change current user's password
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Missing fields
 *       401:
 *         description: Incorrect old password / unauthorized
 *       403:
 *         description: New password does not meet requirements
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put("/change-password", authMiddleware, changePassword);

/**
 * @swagger
 * /auth/delete:
 *   delete:
 *     summary: Delete the authenticated user's account
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       400:
 *         description: Missing password
 *       401:
 *         description: Incorrect password
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete("/delete", authMiddleware, deleteAccount);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User credit operations
 */

/**
 * @swagger
 * /auth/add-credits/{userId}:
 *   put:
 *     summary: Add or subtract credits from a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 50
 *     responses:
 *       200:
 *         description: Credits updated successfully
 *       400:
 *         description: Invalid or missing amount
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put("/add-credits/:userId", addCredits);

export default router;
