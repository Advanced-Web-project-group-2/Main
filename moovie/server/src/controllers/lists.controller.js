import pool from "../db.js";
import { addCreditsToUser } from "../services/reward.service.js";

// ------------------- GET FAVOURITES -------------------
export const getFavourites = async (req, res) => {
  try {
    const userId = req.user.id;
    const listRes = await pool.query(
      "SELECT id FROM lists WHERE owner_id = $1 AND name = 'Favourites'",
      [userId]
    );

    if (listRes.rowCount === 0) return res.json({ favourites: [] });

    const listId = listRes.rows[0].id;
    const moviesRes = await pool.query(
      `SELECT m.id, m.name, m.genre, m.release_year, m.poster_url
       FROM list_movies lm
       JOIN movies m ON lm.movie_id = m.id
       WHERE lm.list_id = $1`,
      [listId]
    );

    res.json({ favourites: moviesRes.rows });
  } catch (err) {
    console.error("Get favourites error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ------------------- ADD TO FAVOURITES -------------------
export const addFavourite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { movieId, movieName, posterUrl, releaseYear, genre } = req.body;

    if (!movieId) return res.status(400).json({ error: "movieId required" });

    await pool.query(
      `INSERT INTO movies (id, name, poster_url, release_year, genre)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO NOTHING`,
      [movieId, movieName || "-", posterUrl || null, releaseYear || null, genre || null]
    );

    let listRes = await pool.query(
      "SELECT id FROM lists WHERE owner_id = $1 AND name = 'Favourites'",
      [userId]
    );

    let listId = listRes.rowCount
      ? listRes.rows[0].id
      : (
          await pool.query(
            "INSERT INTO lists (owner_id, name) VALUES ($1, 'Favourites') RETURNING id",
            [userId]
          )
        ).rows[0].id;

    const insertResult = await pool.query(
      "INSERT INTO list_movies (list_id, movie_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *",
      [listId, movieId]
    );

    // Only award credits if the movie was newly added (not a duplicate)
    if (insertResult.rowCount > 0) {
      try {
        await addCreditsToUser(userId, 2);
      } catch (creditErr) {
        console.error("Error adding reward credits:", creditErr);
      }
    }

    res.json({ message: "Added to favourites" });
  } catch (err) {
    console.error("Add favourite error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ------------------- REMOVE FAVOURITE -------------------
export const removeFavourite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { movieId } = req.body;

    if (!movieId) return res.status(400).json({ error: "movieId required" });

    const listRes = await pool.query(
      "SELECT id FROM lists WHERE owner_id = $1 AND name = 'Favourites'",
      [userId]
    );

    if (listRes.rowCount === 0) return res.status(404).json({ error: "Favourites not found" });

    await pool.query("DELETE FROM list_movies WHERE list_id = $1 AND movie_id = $2", [
      listRes.rows[0].id,
      movieId,
    ]);

    res.json({ message: "Movie removed" });
  } catch (err) {
    console.error("Remove favourite error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ------------------- PUBLIC LIST -------------------
export const getPublicFavourites = async (req, res) => {
  try {
    const { userId } = req.params;
    const listRes = await pool.query(
      "SELECT id FROM lists WHERE owner_id = $1 AND name = 'Favourites'",
      [userId]
    );
    if (listRes.rowCount === 0) return res.json({ favourites: [] });

    const movieRes = await pool.query(
      `SELECT m.id, m.name, m.genre, m.release_year, m.poster_url
       FROM list_movies lm
       JOIN movies m ON lm.movie_id = m.id
       WHERE lm.list_id = $1`,
      [listRes.rows[0].id]
    );

    res.json({ favourites: movieRes.rows });
  } catch (err) {
    console.error("Get public error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ------------------- CUSTOM LIST SUPPORT -------------------
export const createList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description } = req.body;

    if (!name) return res.status(400).json({ error: "List name required" });

    const result = await pool.query(
      "INSERT INTO lists (owner_id, name, description) VALUES ($1, $2, $3) RETURNING *",
      [userId, name, description || null]
    );

    res.json({ list: result.rows[0] });
  } catch (err) {
    console.error("Create list error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserLists = async (req, res) => {
  try {
    const userId = req.user.id;
    const lists = await pool.query(
      "SELECT * FROM lists WHERE owner_id = $1 AND name != 'Favourites'",
      [userId]
    );
    res.json({ lists: lists.rows });
  } catch (err) {
    console.error("Get lists error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addMovieToList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { listId } = req.params;
    const { movieId, movieName, releaseYear, posterUrl, genre } = req.body;

    if (!movieId) return res.status(400).json({ error: "movieId required" });

    await pool.query(
      `INSERT INTO movies (id, name, genre, release_year, poster_url)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO NOTHING`,
      [movieId, movieName || "-", genre || null, releaseYear || null, posterUrl || null]
    );

    await pool.query(
      "INSERT INTO list_movies (list_id, movie_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [listId, movieId]
    );

    res.json({ message: "Movie added to list" });
  } catch (err) {
    console.error("Add movie to list error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const removeMovieFromList = async (req, res) => {
  try {
    const { listId } = req.params;
    const { movieId } = req.body;

    await pool.query("DELETE FROM list_movies WHERE list_id = $1 AND movie_id = $2", [
      listId,
      movieId,
    ]);

    res.json({ message: "Movie removed from list" });
  } catch (err) {
    console.error("Remove movie error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getListMovies = async (req, res) => {
  try {
    const { listId } = req.params;
    const movies = await pool.query(
      `SELECT m.id, m.name, m.genre, m.release_year, m.poster_url
       FROM list_movies lm
       JOIN movies m ON lm.movie_id = m.id
       WHERE lm.list_id = $1`,
      [listId]
    );
    res.json({ movies: movies.rows });
  } catch (err) {
    console.error("Get list movies error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
