/* import express from 'express';
import cors from 'cors';
import pool from './db.js';  // import the Pool from db.js

const port = 3001;
const app = express();

app.use(cors());
app.use(express.json()); // global JSON parsing

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
app.delete('/delete-user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}) */
