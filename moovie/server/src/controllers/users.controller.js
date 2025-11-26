import pool from "../db.js";

export const addCredits = async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount } = req.body;

    if (amount === undefined || amount === null || isNaN(amount)) {
      return res.status(400).json({ error: "Amount must be a number" });
    }

    const numericAmount = Number(amount);

    const result = await pool.query(
      "UPDATE users SET credits = credits + $1 WHERE id = $2 RETURNING id, username, credits",
      [numericAmount, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Credits updated successfully",
      user: result.rows[0],
    });

  } catch (err) {
    console.error("addCredits error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// CRUD-requests for users
// GET all users
export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST to add a user
export const addUser = async (req, res) => {
  const { username, passhash, credits } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (username, passhash, credits) VALUES ($1, $2, $3) RETURNING *',
      [username, passhash, credits || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT to update user (username, password)
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, passhash } = req.body;
  

    // Check if atleast 1 field is provided
    if (!username && !passhash ) {
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
};

// DELETE to delete a user
export const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;
    // Deleting user requested
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully', deletedUser: result.rows[0] });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
