// server/src/routes/shop.routes.js
import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  getAvailableShopItems,
  getInventory,
  getShopItems,
  buyItem,
  getUserItemsByType,
  equipIcon,
  toggleAccessory,
  getEquippedItems
} from "../controllers/shop.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Shop
 *   description: Shop and user item management
 */

/**
 * @swagger
 * /shop/available:
 *   get:
 *     summary: Get items the user does not own yet
 *     tags: [Shop]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of available items
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Failed to load available items
 */
router.get("/available", authMiddleware, getAvailableShopItems);

/**
 * @swagger
 * /shop:
 *   get:
 *     summary: Get all shop items the user does not yet own
 *     tags: [Shop]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of shop items
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Failed to load shop items
 */
router.get("/", authMiddleware, getShopItems);

/**
 * @swagger
 * /shop/buy/{itemId}:
 *   post:
 *     summary: Buy an item
 *     tags: [Shop]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Purchase completed
 *       400:
 *         description: Already owned or insufficient credits
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Item not found
 *       500:
 *         description: Purchase failed
 */
router.post("/buy/:itemId", authMiddleware, buyItem);

/**
 * @swagger
 * /shop/inventory:
 *   get:
 *     summary: Get inventory (all owned items)
 *     tags: [Shop]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User inventory returned
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Failed to load inventory
 */
router.get("/inventory", authMiddleware, getInventory);

/**
 * @swagger
 * /shop/user-items/icons:
 *   get:
 *     summary: Get icon items the user owns
 *     tags: [Shop]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Icons returned
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Failed to fetch icons
 */
router.get("/user-items/icons", authMiddleware, (req, res) =>
  getUserItemsByType({ ...req, params: { itemType: "icons" } }, res)
);

/**
 * @swagger
 * /shop/user-items/accessories:
 *   get:
 *     summary: Get accessory items the user owns
 *     tags: [Shop]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Accessories returned
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Failed to fetch accessories
 */
router.get("/user-items/accessories", authMiddleware, (req, res) =>
  getUserItemsByType({ ...req, params: { itemType: "accessories" } }, res)
);

/**
 * @swagger
 * /shop/equip/icon/{itemId}:
 *   patch:
 *     summary: Equip a single icon (unequips others)
 *     tags: [Shop]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Icon equipped
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Not owned or invalid icon
 *       500:
 *         description: Failed to equip icon
 */
router.patch("/equip/icon/:itemId", authMiddleware, equipIcon);

/**
 * @swagger
 * /shop/equip/accessory/{itemId}:
 *   patch:
 *     summary: Toggle an accessory item on/off
 *     tags: [Shop]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Accessory equipped or unequipped
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Accessory not owned or invalid
 *       500:
 *         description: Failed to toggle accessory
 */
router.patch("/equip/accessory/:itemId", authMiddleware, toggleAccessory);

/**
 * @swagger
 * /shop/equipped:
 *   get:
 *     summary: Get current user's equipped items
 *     tags: [Shop]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Equipped items returned
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Failed to load equipped items
 */
router.get("/equipped", authMiddleware, getEquippedItems);

/**
 * @swagger
 * /shop/equipped/{userId}:
 *   get:
 *     summary: Get another user's equipped items (public)
 *     tags: [Shop]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Equipped items returned
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to load equipped items
 */
router.get("/equipped/:userId", async (req, res) => {
  try {
    req.user = { id: req.params.userId };
    return getEquippedItems(req, res);
  } catch (err) {
    console.error("Error fetching equipped items:", err);
    return res.status(500).json({ error: "Failed to fetch avatar" });
  }
});

export default router;
