import { verifyToken } from "../services/jwt.service.js";

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Missing authorization header" });
  }

  const [, token] = authHeader.split(" ");
  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const decoded = verifyToken(token);

    req.user = {
      id: decoded.id,
      username: decoded.username
    };

    next();
  } catch (err) {
    console.error("AUTH MIDDLEWARE ERROR:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
