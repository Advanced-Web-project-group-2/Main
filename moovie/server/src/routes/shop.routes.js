import express from "express";
import authMiddleware from "../middleware/auth.js";
import { getShopItems, buyItem, getInventory } from "../controllers/shop.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getShopItems);
router.get("/inventory", authMiddleware, getInventory);
router.post("/buy/:itemId", authMiddleware, buyItem);

export default router;
