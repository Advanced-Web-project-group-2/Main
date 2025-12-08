import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../.env.test"),
  override: true,
});

console.log("Loaded Jest env:", {
  NODE_ENV: process.env.NODE_ENV,
  PGHOST: process.env.PGHOST,
  PGPORT: process.env.PGPORT,
});
