import pool from "../db.js";

/**
 * Adds credits to a user's account
 * @param {string} userId - The UUID of the user
 * @param {number} amount - The amount of credits to add
 * @returns {Promise<Object>} The updated user object with new credits total
 */
export const addCreditsToUser = async (userId, amount) => {
  try {
    const result = await pool.query(
      "UPDATE users SET credits = credits + $1 WHERE id = $2 RETURNING id, username, credits",
      [amount, userId]
    );

    if (result.rowCount === 0) {
      throw new Error("User not found");
    }

    return result.rows[0];
  } catch (err) {
    console.error("Error adding credits:", err);
    throw err;
  }
};
