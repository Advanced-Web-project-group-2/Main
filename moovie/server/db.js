import pkg from 'pg';
import 'dotenv/config';
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,  
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});


pool.connect((err, client, release) => {
  if (err) return console.error('Error acquiring client', err.stack);
  console.log('Connected to PostgreSQL successfully!');
  release();
});

export default pool;
