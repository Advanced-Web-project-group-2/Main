import pool from "../db.js";

// Get reviews for a specific movie
export const getReviews = async (req, res) => {
  const { movieId } = req.params;

  try {
    const result = await pool.query(
      `SELECT r.id, r.user_id, u.username, r.content, r.rating, 
              r.likes, r.dislikes, r.created_at
       FROM reviews r
       JOIN users u ON r.user_id = u.id
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

  // Check login
  if (!user_id) {
    return res.status(401).json({ error: "You must be logged in to submit a review" });
  }

  // Check movie_id
  if (!movie_id) {
    return res.status(400).json({ error: "Movie ID is required" });
  }

  // Check content
  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Review text is required to submit a rating" });
  }

  // Check rating
  if (!rating) {
    return res.status(400).json({ error: "Rating is required" });
  }

  try {
    // Prevent multiple reviews per user per movie
    const existing = await pool.query(
      `SELECT id FROM reviews WHERE user_id = $1 AND movie_id = $2`,
      [user_id, movie_id]
    );

    if (existing.rowCount > 0) {
      return res.status(400).json({ error: "You have already reviewed this movie" });
    }

    // Insert new review
    const result = await pool.query(
      `INSERT INTO reviews (user_id, movie_id, movie_name, content, rating)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user_id, movie_id, movie_name || null, content, rating]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding review:", err);
    res.status(500).json({ error: "Failed to add review" });
  }
};
