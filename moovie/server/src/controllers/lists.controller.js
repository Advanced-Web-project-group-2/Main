import pool from "../db.js";

// Get user's fav list
export const getFavourites = async (req, res) => {
    try {
        const userId = req.user.id;
        const listRes = await pool.query(
            "SELECT id from lists WHERE owner_id = $1 AND name = 'Favourites'",
            [userId]
        );

        if (listRes.rowCount === 0) {
            return res.json({ favourites: [] });
        }

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

// Add a movie to favourites
export const addFavourite = async (req, res) => {
    try {
        const userId = req.user.id;
        const { movieId } = req.body;
        if (!movieId) return res.status(400).json({ error: "movieId is required" });

        let listRes = await pool.query(
            "SELECT id FROM lists WHERE owner_id = $1 AND name = 'Favourites'",
            [userId]
        );

        let listId;
        if (listRes.rowCount === 0) {
            // create favourites list if it doesn't exist
            const newList = await pool.query(
                "INSERT INTO lists (owner_id, name) VALUES ($1, 'Favourites') RETURNING id",
                [userId] 
            );
            listId = newList.rows[0].id;
        } else {
            listId = listRes.rows[0].id;
        }

        // Add movie to list_movies
        await pool.query(
            "INSERT INTO list_movies (list_id, movie_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [listId, movieId]
        );

        res.json({ message: "Movie added to favourites" });
    } catch (err) {
        console.error("Add favourite error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Remove movie from favourites
export const removeFavourite = async (req, res) => {
    try {
        const userId = req.user.id;
        const { movieId } = req.body;
        if (!movieId) return res.status(400).json({ error: "movieId is required" });

        const listRes = await pool.query(
            "SELECT id FROM lists WHERE owner_id = $1 AND name = 'Favourites'",
            [userId]
        );
        if (listRes.rowCount === 0) return res.status(404).json({ error: "Favourites list not found" });

        await pool.query(
            "DELETE FROM list_movies WHERE list_id = $1 AND movie_id = $2",
            [listRes.rows[0].id, movieId]
        );

        res.json({ message: "Movie removed from favourites" });
    } catch (err) {
        console.error("Remove favourite error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Share favourites list (public view)
export const getPublicFavourites = async (req, res) => {
    try {
        const { userId } = req.params;
        const listRes = await pool.query(
            "SELECT id FROM lists WHERE owner_id = $1 AND name = 'Favourites'",
            [userId]
        );
        if (listRes.rowCount === 0) return res.json({ favourites: [] });

        const listId = listRes.rows[0].id;
        const movieRes = await pool.query(
            `SELECT m.id, m.name, m.genre, m.release_year, m.poster_url
            FROM list_movies lm
            JOIN movies m ON lm.movie_id = m.id
            WHERE lm.list_id = $1`,
            [listId]
        );

        res.json({ favourites: movieRes.rows });
    } catch (err) {
        console.error("Get public favourites error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};