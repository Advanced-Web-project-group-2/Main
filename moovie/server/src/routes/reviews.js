import express from "express";
import { getReviews, addReview } from "../controllers/reviews.controller.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Movie reviews and ratings
 */

/**
 * @swagger
 * /api/reviews/{movieId}:
 *   get:
 *     summary: Get reviews for a movie
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of reviews and average rating
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       user_id:
 *                         type: integer
 *                       username:
 *                         type: string
 *                       content:
 *                         type: string
 *                       rating:
 *                         type: number
 *                       likes:
 *                         type: integer
 *                       dislikes:
 *                         type: integer
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                 avgRating:
 *                   type: number
 *       500:
 *         description: Server error
 */
router.get("/:movieId", getReviews);

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Submit a review for a movie
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [movie_id, content, rating]
 *             properties:
 *               movie_id:
 *                 type: integer
 *               movie_name:
 *                 type: string
 *                 example: "Inception"
 *               content:
 *                 type: string
 *                 example: "Amazing movie with mind-bending visuals!"
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 10
 *     responses:
 *       201:
 *         description: Review created
 *       400:
 *         description: Validation error or already reviewed
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Server error
 */
router.post("/", authMiddleware, addReview);

export default router;
