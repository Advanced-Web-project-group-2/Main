import pool from "../src/db.js";

async function waitForDb(retries = 10, delay = 2000) {
  while (retries > 0) {
    try {
      await pool.query("SELECT 1");
      console.log("Database is ready.");
      return;
    } catch (err) {
      retries--;
      console.log(`DB not ready, retrying... (${retries} retries left)`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }

  throw new Error("Database connection failed after retries.");
}

export default async function seedShop() {
  try {
    // Wait for PostgreSQL to start
    await waitForDb();

    const { rows } = await pool.query("SELECT COUNT(*) FROM shop");
    if (parseInt(rows[0].count) > 0) {
      console.log("Shop already seeded.");
      return;
    }

    await pool.query(`
      INSERT INTO shop (name, price, type, image_url, layer_index) VALUES
      ('Black & White Basic', 10, 'icon', '/src/assets/images/Shop/Lehmat/bw_basic.png', 0),
      ('Black & White Horns', 20, 'icon', '/src/assets/images/Shop/Lehmat/bw_horns.png', 0),
      ('Black & White Hair', 30, 'icon', '/src/assets/images/Shop/Lehmat/bw_hair.png', 0),

      ('Brown Basic', 10, 'icon', '/src/assets/images/Shop/Lehmat/brown_basic.png', 0),
      ('Brown Horns', 20, 'icon', '/src/assets/images/Shop/Lehmat/brown_horns.png', 0),
      ('Brown Hair', 30, 'icon', '/src/assets/images/Shop/Lehmat/brown_hair.png', 0),

      ('Heavy Basic', 10, 'icon', '/src/assets/images/Shop/Lehmat/heavy_basic.png', 0),
      ('Heavy Horns', 20, 'icon', '/src/assets/images/Shop/Lehmat/heavy_horns.png', 0),
      ('Heavy Hair', 30, 'icon', '/src/assets/images/Shop/Lehmat/heavy_hair.png', 0),

      ('Kiffe Basic', 10, 'icon', '/src/assets/images/Shop/Lehmat/kiffe_basic.png', 0),
      ('Kiffe Horns', 20, 'icon', '/src/assets/images/Shop/Lehmat/kiffe_horns.png', 0),
      ('Kiffe Hair', 30, 'icon', '/src/assets/images/Shop/Lehmat/kiffe_hair.png', 0),

      ('Pink Basic', 50, 'icon', '/src/assets/images/Shop/Lehmat/pink_basic.png', 0),
      ('Pink Horns', 80, 'icon', '/src/assets/images/Shop/Lehmat/pink_horns.png', 0),
      ('Pink Hair', 100, 'icon', '/src/assets/images/Shop/Lehmat/pink_hair.png', 0),

      ('Star Basic', 50, 'icon', '/src/assets/images/Shop/Lehmat/star_basic.png', 0),
      ('Star Horns', 80, 'icon', '/src/assets/images/Shop/Lehmat/star_horns.png', 0),
      ('Star Hair', 100, 'icon', '/src/assets/images/Shop/Lehmat/star_hair.png', 0),

      ('Paula Horns', 150, 'icon', '/src/assets/images/Shop/Lehmat/paula_horns.png', 0),

      ('3D Glasses', 50, 'accessory', '/src/assets/images/Shop/Accessories/3dclasses.png', 30),
      ('Sunglasses', 50, 'accessory', '/src/assets/images/Shop/Accessories/sunglasses.png', 30),
      ('Earings', 20, 'accessory', '/src/assets/images/Shop/Accessories/earings.png', 10),
      ('Hat', 30, 'accessory', '/src/assets/images/Shop/Accessories/hat.png', 20),
      ('Ribbon', 30, 'accessory', '/src/assets/images/Shop/Accessories/ribbon.png', 20),
      ('Tongue', 20, 'accessory', '/src/assets/images/Shop/Accessories/tongue.png', 40)
    `);

    console.log("Shop seeded successfully.");
  } catch (err) {
    console.error("SEED ERROR:", err);
  }
}
