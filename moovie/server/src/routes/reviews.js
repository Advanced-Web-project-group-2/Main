// server/src/routes/reviews.js
import express from "express";
import { getReviews, addReview, likeReview, dislikeReview } from "../controllers/reviews.controller.js";
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
 * /api/reviews/{reviewId}/like:
 *   post:
 *     summary: Like a review (toggle on/off)
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Like toggled or switched from dislike → like
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 liked:
 *                   type: boolean
 *       400:
 *         description: Cannot like own review
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Review not found
 *       500:
 *         description: Internal server error
 */
router.post("/:reviewId/like", authMiddleware, likeReview);

/**
 * @swagger
 * /api/reviews/{reviewId}/dislike:
 *   post:
 *     summary: Dislike a review (toggle on/off)
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dislike toggled or switched from like → dislike
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 disliked:
 *                   type: boolean
 *       400:
 *         description: Cannot dislike own review
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Review not found
 *       500:
 *         description: Internal server error
 */
router.post("/:reviewId/dislike", authMiddleware, dislikeReview);

/**
 * @swagger
 * /api/reviews/{movieId}:
 *   get:
 *     summary: Get all reviews & average rating for a movie
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reviews returned (empty if none)
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
 *                       id: { type: integer }
 *                       user_id: { type: integer }
 *                       username: { type: string }
 *                       content: { type: string }
 *                       rating: { type: number }
 *                       likes: { type: integer }
 *                       dislikes: { type: integer }
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                 avgRating:
 *                   type: number
 *       500:
 *         description: Internal server error
 */
router.get("/:movieId", getReviews);

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Submit a movie review (one per user per movie)
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
 *               content:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 10
 *     responses:
 *       201:
 *         description: Review created and credits awarded
 *       400:
 *         description: Missing fields OR already reviewed
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 */
router.post("/", authMiddleware, addReview);

export default router;
