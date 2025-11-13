import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
const PORT = 5000; 

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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

