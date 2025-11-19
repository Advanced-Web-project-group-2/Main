import express from "express";
import { getReviews, addReview } from "../controllers/reviews.controller.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Get reviews for a specific movie
router.get("/:movieId", getReviews);

// Post a review when logged-in
router.post("/", authMiddleware, addReview);

export default router;

