import pool from "../src/db.js";

beforeAll(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      movie_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      rating INTEGER NOT NULL,
      user_id INTEGER REFERENCES users(id)
    );
  `);
});

afterAll(async () => {
  await pool.query("DROP TABLE IF EXISTS reviews;");
  await pool.query("DROP TABLE IF EXISTS users;");
  await pool.end();
});
