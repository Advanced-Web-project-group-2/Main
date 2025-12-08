import app from "./app.js";
import seedShop from "../db/seed.js";

const PORT = process.env.PORT || 5000;

seedShop().catch(err => console.error("SEED ERROR:", err));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
