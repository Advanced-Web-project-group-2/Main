import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Only load .env if it exists (for local development)
if (fs.existsSync(path.resolve('.env'))) {
  dotenv.config();
}

console.log('Environment variables loaded. NODE_ENV:', process.env.NODE_ENV || 'production');

import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { fileURLToPath } from 'url';

import pool from './db.js';
import reviewsRouter from "./routes/reviews.js";
import seedShop from "../db/seed.js";
import shopRoutes from "./routes/shop.routes.js";
import usersRoutes from "./routes/users.routes.js";
import authRoutes from "./routes/auth.routes.js";
import listsRoutes from "./routes/lists.routes.js";
import groupsRoutes from './routes/groups.routes.js';

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { setupSwagger } from "./swagger.js";

// Correct __dirname setup for ESM:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;
const TMDB_API_KEY = process.env.TMDB_API_KEY || "e7b2a2baf908be99c03d69f99197bea2"; // fallback if env not set
const app = express();

// ---------------------- MIDDLEWARE ----------------------
app.use(cors());
app.use(express.json());

// ---------------------- SWAGGER SETUP ----------------------
setupSwagger(app);

// ---------------------- ROUTES ----------------------
app.use("/api/lists", listsRoutes);
app.use("/auth", authRoutes);
app.use("/api/reviews", reviewsRouter);
app.use("/shop", shopRoutes);
app.use("/users", usersRoutes);
app.use("/api/groups", groupsRoutes);

// Serve assets
app.use("/src/assets", express.static(path.join(__dirname, "../client/src/assets")));

// ---------------------- TMDB PROXY ----------------------
app.get('/api/now-playing', async (req, res) => {
  try {
    const response = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
      params: { api_key: TMDB_API_KEY, language: 'en-US', page: 1 }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch now playing movies' });
  }
});

app.get('/api/search', async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.status(400).json({ error: 'Missing query parameter q' });

  try {
    const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: { api_key: TMDB_API_KEY, query: q, language: 'en-US', page: 1, include_adult: false }
    });
    res.json(response.data);
  } catch (err) {
    console.error('Search proxy error', err?.message || err);
    res.status(500).json({ error: 'Failed to perform search' });
  }
});

// ---------------------- STATIC FRONTEND ----------------------
// Serve raw client assets referenced by seeded image URLs (/src/assets/...)
app.use('/src/assets', express.static(path.resolve(__dirname, '../assets')));

// Place this after *all* API/server routes!
const distPath = path.resolve(__dirname, '../client/dist');
console.log('Serving static files from:', distPath);
app.use(express.static(distPath));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// ---------------------- SERVER ----------------------
seedShop().catch(err => console.error("SEED ERROR:", err));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});