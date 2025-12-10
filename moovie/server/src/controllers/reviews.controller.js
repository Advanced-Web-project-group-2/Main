import pool from "../db.js";
import { addCreditsToUser } from "../services/reward.service.js";

// Get reviews for a specific movie
export const getReviews = async (req, res) => {
  const { movieId } = req.params;

  try {
    const result = await pool.query(
      `SELECT r.id, r.user_id, u.username, r.content, r.rating, r.created_at,
              COALESCE(l.likes, 0) AS likes,
              COALESCE(d.dislikes, 0) AS dislikes
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       LEFT JOIN (
           SELECT review_id, COUNT(*) AS likes
           FROM review_votes
           WHERE vote_type = 'like'
           GROUP BY review_id
       ) l ON r.id = l.review_id
       LEFT JOIN (
           SELECT review_id, COUNT(*) AS dislikes
           FROM review_votes
           WHERE vote_type = 'dislike'
           GROUP BY review_id
       ) d ON r.id = d.review_id
       WHERE r.movie_id = $1
       ORDER BY r.created_at DESC`,
      [movieId]
    );

    const reviews = result.rows;
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    res.json({ reviews, avgRating });
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

// Add a review (user must be logged in)
export const addReview = async (req, res) => {
  const { movie_id, movie_name, content, rating } = req.body;
  const user_id = req.user?.id; // from authMiddleware

  if (!user_id) {
    return res.status(401).json({ error: "You must be logged in to submit a review" });
  }

  if (!movie_id) {
    return res.status(400).json({ error: "Movie ID is required" });
  }

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Review text is required to submit a rating" });
  }

  if (!rating) {
    return res.status(400).json({ error: "Rating is required" });
  }

  try {
    const existing = await pool.query(
      `SELECT id FROM reviews WHERE user_id = $1 AND movie_id = $2`,
      [user_id, movie_id]
    );

    if (existing.rowCount > 0) {
      return res.status(400).json({ error: "You have already reviewed this movie" });
    }

    const result = await pool.query(
      `INSERT INTO reviews (user_id, movie_id, movie_name, content, rating)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user_id, movie_id, movie_name || null, content, rating]
    );

    // Award +3 credits for leaving a review
    try {
      await addCreditsToUser(user_id, 3);
    } catch (creditErr) {
      console.error("Error adding reward credits:", creditErr);
      // Don't fail the review submission if credit reward fails
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding review:", err);
    res.status(500).json({ error: "Failed to add review" });
  }
};

// Like a review
export const likeReview = async (req, res) => {
  const user_id = req.user?.id;
  const { reviewId } = req.params;

  if (!user_id) return res.status(401).json({ error: "Login required" });

  try {
    // Check review ownership
    const reviewCheck = await pool.query(
      "SELECT user_id FROM reviews WHERE id = $1",
      [reviewId]
    );

    if (!reviewCheck.rows[0]) return res.status(404).json({ error: "Review not found" });

    if (reviewCheck.rows[0].user_id === user_id) {
      return res.status(400).json({ error: "Can't vote your own review" });
    }

    // Check existing vote
    const existing = await pool.query(
      "SELECT vote_type FROM review_votes WHERE user_id = $1 AND review_id = $2",
      [user_id, reviewId]
    );

    if (existing.rows[0]?.vote_type === "like") {
      // Undo like
      await pool.query(
        "DELETE FROM review_votes WHERE user_id = $1 AND review_id = $2",
        [user_id, reviewId]
      );
      return res.json({ liked: false });
    }

    if (existing.rows[0]?.vote_type === "dislike") {
      // Switch dislike → like
      await pool.query(
        "UPDATE review_votes SET vote_type = 'like' WHERE user_id = $1 AND review_id = $2",
        [user_id, reviewId]
      );
      // Award +1 credit for adding a like vote
      try {
        await addCreditsToUser(user_id, 1);
      } catch (creditErr) {
        console.error("Error adding reward credits:", creditErr);
      }
      return res.json({ liked: true });
    }

    // New like - Award +1 credit for adding a like vote
    await pool.query(
      "INSERT INTO review_votes (user_id, review_id, vote_type) VALUES ($1, $2, 'like')",
      [user_id, reviewId]
    );

    try {
      await addCreditsToUser(user_id, 1);
    } catch (creditErr) {
      console.error("Error adding reward credits:", creditErr);
    }

    res.json({ liked: true });
  } catch (err) {
    console.error("Like error:", err);
    res.status(500).json({ error: "Failed to like review" });
  }
};

// Dislike a review
export const dislikeReview = async (req, res) => {
  const user_id = req.user?.id;
  const { reviewId } = req.params;

  if (!user_id) return res.status(401).json({ error: "Login required" });

  try {
    // Check review ownership
    const reviewCheck = await pool.query(
      "SELECT user_id FROM reviews WHERE id = $1",
      [reviewId]
    );

    if (!reviewCheck.rows[0]) return res.status(404).json({ error: "Review not found" });

    if (reviewCheck.rows[0].user_id === user_id) {
      return res.status(400).json({ error: "Can't vote your own review" });
    }

    // Check existing vote
    const existing = await pool.query(
      "SELECT vote_type FROM review_votes WHERE user_id = $1 AND review_id = $2",
      [user_id, reviewId]
    );

    if (existing.rows[0]?.vote_type === "dislike") {
      // Undo dislike
      await pool.query(
        "DELETE FROM review_votes WHERE user_id = $1 AND review_id = $2",
        [user_id, reviewId]
      );
      return res.json({ disliked: false });
    }

    if (existing.rows[0]?.vote_type === "like") {
      // Switch like → dislike
      await pool.query(
        "UPDATE review_votes SET vote_type = 'dislike' WHERE user_id = $1 AND review_id = $2",
        [user_id, reviewId]
      );
      // Award +1 credit for adding a dislike vote
      try {
        await addCreditsToUser(user_id, 1);
      } catch (creditErr) {
        console.error("Error adding reward credits:", creditErr);
      }
      return res.json({ disliked: true });
    }

    // New dislike - Award +1 credit for adding a dislike vote
    await pool.query(
      "INSERT INTO review_votes (user_id, review_id, vote_type) VALUES ($1, $2, 'dislike')",
      [user_id, reviewId]
    );

    try {
      await addCreditsToUser(user_id, 1);
    } catch (creditErr) {
      console.error("Error adding reward credits:", creditErr);
    }

    res.json({ disliked: true });
  } catch (err) {
    console.error("Dislike error:", err);
    res.status(500).json({ error: "Failed to dislike review" });
  }
};
