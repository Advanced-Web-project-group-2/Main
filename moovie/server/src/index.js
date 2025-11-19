import dotenv from 'dotenv';
dotenv.config();

import { setupSwagger } from "./swagger.js";

import express from 'express';
import cors from 'cors';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js'
import reviewsRouter from "./routes/reviews.js";


import authMiddleware from './middleware/auth.js';

import authRoutes from "./routes/auth.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 5000; 
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/reviews", reviewsRouter);

setupSwagger(app);

app.use("/auth", authRoutes);


// Fetch now-playing movies from TMDB
app.get('/api/now-playing', async (req, res) => {
  try {
    const response = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
      params: { api_key: process.env.TMDB_API_KEY, language: 'en-US', page: 1 }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch now playing movies' });
  }
});


// Minimal search proxy to TMDB (used by the frontend basicSearch util)
app.get('/api/search', async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.status(400).json({ error: 'Missing query parameter q' });

  try {
    // Use the TMDB movie search endpoint so we only return movies
    const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: {
        api_key: process.env.TMDB_API_KEY,
        query: q,
        language: 'en-US',
        page: 1,
        include_adult: false,
      },
    });

    // Return the TMDB response as-is. Frontend will read `results`.
    res.json(response.data);
  } catch (err) {
    console.error('Search proxy error', err?.message || err);
    res.status(500).json({ error: 'Failed to perform search' });
  }
});

// CRUD-requests for users
// GET all users
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST to add a user
app.post('/add-user', async (req, res) => {
  const { username, passhash, credits, icon } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (username, passhash, credits, icon) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, passhash, credits || 0, icon || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT to update user (username, password, icon)
app.put('/update-user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, passhash, icon } = req.body;
  

    // Check if atleast 1 field is provided
    if (!username && !passhash && !icon) {
      return res.status(400).json({ error: 'No fields to update provided' });
    }

    // Query depending on which fields are provided
    const fields = [];
    const values = [];
    let index = 1;

    if (username) {
      fields.push(`username = $${index++}`);
      values.push(username);
    }
    if (passhash) {
      fields.push(`passhash = $${index++}`);
      values.push(passhash);
    }
    if (icon) {
      fields.push(`icon = $${index++}`);
      values.push(icon);
    }

    values.push(userId);

    const query = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = $${index}
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User updated successfully', updatedUser: result.rows[0] }); 

  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ error: 'Internal server error'});
  }
});

// DELETE to delete a user
app.delete('/auth/delete', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Deleting user with ID:', req.user.id);
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully', deletedUser: result.rows[0] });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log("Swagger should now be available at http://localhost:5000/docs");

});

