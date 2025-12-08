import pool from "../src/db.js";

beforeAll(async () => {
  await pool.query(`
    TRUNCATE TABLE 
      review_votes,
      reviews,
      user_items,
      lists,
      list_movies,
      group_user,
      group_movies,
      groups,
      movies,
      users,
      shop
    RESTART IDENTITY CASCADE;
  `);
});

afterAll(async () => {
  await pool.end();
});
