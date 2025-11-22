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
import seedShop from "../db/seed.js";
import shopRoutes from "./routes/shop.routes.js";
import usersRoutes from "./routes/users.routes.js";

import authMiddleware from './middleware/auth.js';

import authRoutes from "./routes/auth.routes.js";
import listsRoutes from "./routes/lists.routes.js";
import groupsRoutes from './routes/groups.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 5000; 
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/reviews", reviewsRouter);

setupSwagger(app);

seedShop().catch(err => console.error("SEED ERROR:", err));

app.use("/auth", authRoutes);
app.use("/api/lists", listsRoutes);
app.use("/shop", shopRoutes);
app.use("/users", usersRoutes);
app.use('/api/groups', groupsRoutes);



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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log("Swagger should now be available at http://localhost:5000/docs");
});
