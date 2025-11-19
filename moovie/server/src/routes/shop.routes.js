import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  getAvailableShopItems,
  getInventory,
  getShopItems,
  buyItem,
  getUserItemsByType,
} from "../controllers/shop.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Shop
 *   description: Shop and user items management
 */

/**
 * @swagger
 * /shop/available:
 *   get:
 *     summary: Get all available items that the user has not yet purchased
 *     tags: [Shop]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of available items
 */
router.get("/available", authMiddleware, getAvailableShopItems);

/**
 * @swagger
 * /shop:
 *   get:
 *     summary: Get all shop items
 *     tags: [Shop]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns all items
 */
router.get("/", authMiddleware, getShopItems);

/**
 * @swagger
 * /shop/buy/{itemId}:
 *   post:
 *     summary: Buy an item from the shop
 *     tags: [Shop]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the item to purchase
 *     responses:
 *       200:
 *         description: Item bought successfully
 *       400:
 *         description: Not enough credits or item already purchased
 */
router.post("/buy/:itemId", authMiddleware, buyItem);

/**
 * @swagger
 * /shop/inventory:
 *   get:
 *     summary: Retrieve all items owned by the logged-in user
 *     tags: [Shop]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of user-owned items
 */
router.get("/inventory", authMiddleware, getInventory);

/**
 * @swagger
 * /shop/user-items/icons:
 *   get:
 *     summary: Get only icons the user owns
 *     tags: [Shop]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of user-owned icon items
 */
router.get("/user-items/icons", authMiddleware, (req, res) =>
  getUserItemsByType({ ...req, params: { itemType: "icons" } }, res)
);

/**
 * @swagger
 * /shop/user-items/accessories:
 *   get:
 *     summary: Get only accessories the user owns
 *     tags: [Shop]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of user-owned accessories
 */
router.get("/user-items/accessories", authMiddleware, (req, res) =>
  getUserItemsByType({ ...req, params: { itemType: "accessories" } }, res)
);

export default router;
