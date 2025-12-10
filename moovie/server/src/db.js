import pkg from 'pg';
const { Pool } = pkg;

let pool;

// Railway injects DATABASE_URL when services are linked
if (process.env.DATABASE_URL) {
  console.log('Connecting via DATABASE_URL (Railway production)');
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
} else {
  // Fallback for local development with .env file
  console.log('Connecting via individual env vars (local development)');
  console.log('Database config:', {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD ? '***' : 'NOT SET',
    port: process.env.PGPORT,
  });
  
  pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: parseInt(process.env.PGPORT),
  });
}

export default pool;