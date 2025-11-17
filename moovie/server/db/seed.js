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
      INSERT INTO shop (name, price, type, image_url) VALUES
      ('Black & White Basic', 10, 'icon', '/src/assets/images/Shop/Lehmat/bw_basic.png'),
      ('Black & White Horns', 20, 'icon', '/src/assets/images/Shop/Lehmat/bw_horns.png'),
      ('Black & White Hair', 30, 'icon', '/src/assets/images/Shop/Lehmat/bw_hair.png'),

      ('Brown Basic', 10, 'icon', '/src/assets/images/Shop/Lehmat/brown_basic.png'),
      ('Brown Horns', 20, 'icon', '/src/assets/images/Shop/Lehmat/brown_horns.png'),
      ('Brown Hair', 30, 'icon', '/src/assets/images/Shop/Lehmat/brown_hair.png'),

      ('Heavy Basic', 10, 'icon', '/src/assets/images/Shop/Lehmat/heavy_basic.png'),
      ('Heavy Horns', 20, 'icon', '/src/assets/images/Shop/Lehmat/heavy_horns.png'),
      ('Heavy Hair', 30, 'icon', '/src/assets/images/Shop/Lehmat/heavy_hair.png'),

      ('Kiffe Basic', 10, 'icon', '/src/assets/images/Shop/Lehmat/kiffe_basic.png'),
      ('Kiffe Horns', 20, 'icon', '/src/assets/images/Shop/Lehmat/kiffe_horns.png'),
      ('Kiffe Hair', 30, 'icon', '/src/assets/images/Shop/Lehmat/kiffe_hair.png'),

      ('Pink Basic', 50, 'icon', '/src/assets/images/Shop/Lehmat/pink_basic.png'),
      ('Pink Horns', 80, 'icon', '/src/assets/images/Shop/Lehmat/pink_horns.png'),
      ('Pink Hair', 100, 'icon', '/src/assets/images/Shop/Lehmat/pink_hair.png'),

      ('Star Basic', 50, 'icon', '/src/assets/images/Shop/Lehmat/star_basic.png'),
      ('Star Horns', 80, 'icon', '/src/assets/images/Shop/Lehmat/star_horns.png'),
      ('Star Hair', 100, 'icon', '/src/assets/images/Shop/Lehmat/star_hair.png'),

      ('Paula Horns', 150, 'icon', '/src/assets/images/Shop/Lehmat/paula_horns.png'),

      ('3D Glasses', 50, 'accessory', '/src/assets/images/Shop/Accessories/3dclasses.png'),
      ('Sunglasses', 50, 'accessory', '/src/assets/images/Shop/Accessories/sunglasses.png'),
      ('Earings', 20, 'accessory', '/src/assets/images/Shop/Accessories/earings.png'),
      ('Hat', 30, 'accessory', '/src/assets/images/Shop/Accessories/hat.png'),
      ('Ribbon', 30, 'accessory', '/src/assets/images/Shop/Accessories/ribbon.png'),
      ('Tongue', 20, 'accessory', '/src/assets/images/Shop/Accessories/tongue.png')
    `);

    console.log("Shop seeded successfully.");
  } catch (err) {
    console.error("SEED ERROR:", err);
  }
}
