import dotenv from 'dotenv';
import pool from '../src/db.js';

// Load test env explicitly
dotenv.config({ path: '.env.test' });

beforeEach(async () => {
  // Clean tables (order matters due to FK constraints)
  await pool.query('DELETE FROM review_votes');
  await pool.query('DELETE FROM reviews');
  await pool.query('DELETE FROM user_items');
  await pool.query('DELETE FROM lists');
  await pool.query('DELETE FROM users');
});

afterAll(async () => {
  await pool.end();
});
