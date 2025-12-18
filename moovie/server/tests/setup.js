import dotenv from 'dotenv';
import pool from '../src/db.js';

dotenv.config({ path: '.env.test' });

beforeEach(async () => {
  await pool.query('DELETE FROM review_votes');
  await pool.query('DELETE FROM reviews');
  await pool.query('DELETE FROM user_items');
  await pool.query('DELETE FROM lists');
  await pool.query('DELETE FROM users');
});

afterAll(async () => {
  await pool.end();
});
