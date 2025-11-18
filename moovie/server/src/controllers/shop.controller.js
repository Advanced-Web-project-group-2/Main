import pool from "../db.js";

//GET Shop
export async function getShopItems(req, res) {
  const userId = req.user.id;

  try {
    const result = await pool.query(`
      SELECT * FROM shop
      WHERE id NOT IN (
        SELECT item_id FROM user_items WHERE user_id = $1
      )
      ORDER BY price ASC
    `, [userId]);

    res.json({ items: result.rows });

  } catch (err) {
    console.error("GET SHOP ERROR:", err);
    res.status(500).json({ error: "Failed to load shop items" });
  }
}

//GET Shop Inventory
export async function getInventory(req, res) {
  const userId = req.user.id;

  try {
    const result = await pool.query(`
      SELECT ui.id AS user_item_id, s.*
      FROM user_items ui
      JOIN shop s ON ui.item_id = s.id
      WHERE ui.user_id = $1
    `, [userId]);

    res.json({ inventory: result.rows });

  } catch (err) {
    console.error("GET INVENTORY ERROR:", err);
    res.status(500).json({ error: "Failed to load inventory" });
  }
}

//POST Stop buy item ID
export async function buyItem(req, res) {
  const userId = req.user.id;
  const itemId = parseInt(req.params.itemId);

  try {
    const check = await pool.query(
      "SELECT 1 FROM user_items WHERE user_id = $1 AND item_id = $2",
      [userId, itemId]
    );

    if (check.rowCount > 0) {
      return res.status(400).json({ error: "You already own this item" });
    }

    const itemRes = await pool.query("SELECT price FROM shop WHERE id = $1", [itemId]);

    if (itemRes.rowCount === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    const price = itemRes.rows[0].price;

    const userRes = await pool.query("SELECT credits FROM users WHERE id = $1", [userId]);
    const userCredits = userRes.rows[0].credits;

    if (userCredits < price) {
      return res.status(400).json({ error: "Not enough credits" });
    }

    await pool.query("UPDATE users SET credits = credits - $1 WHERE id = $2",
      [price, userId]
    );

    await pool.query(
      "INSERT INTO user_items (user_id, item_id) VALUES ($1, $2)",
      [userId, itemId]
    );

    res.json({ message: "Purchase complete", price });

  } catch (err) {
    console.error("BUY ITEM ERROR:", err);
    res.status(500).json({ error: "Purchase failed" });
  }
}

export const getUserItemsByType = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemType } = req.params;

    if (!["icons", "accessories"].includes(itemType)) {
      return res.status(400).json({ error: "Invalid item type" });
    }

    const dbType = itemType === "icons" ? "icon" : "accessory";

    const result = await pool.query(
      `SELECT
        ui.id AS user_item_id,
        s.id AS item_id,
        s.name,
        s.price,
        s.type,
        s.image_url,
        ui.is_equipped
       FROM user_items ui
       JOIN shop s ON ui.item_id = s.id
       WHERE ui.user_id = $1 AND s.type = $2
       ORDER BY ui.id`,
      [userId, dbType]
    );

    res.json({ items: result.rows });
  } catch (err) {
    console.error("getUserItemsByType error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export async function getAvailableShopItems(req, res) {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT * FROM shop
       WHERE id NOT IN (
         SELECT item_id FROM user_items WHERE user_id = $1
       )
       ORDER BY price ASC`,
      [userId]
    );

    res.json({ items: result.rows });
  } catch (err) {
    console.error("getAvailableShopItems ERROR:", err);
    res.status(500).json({ error: "Failed to load available items" });
  }
}
