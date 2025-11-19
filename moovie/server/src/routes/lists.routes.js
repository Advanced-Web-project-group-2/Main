import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
    getFavourites,
    addFavourite,
    removeFavourite,
    getPublicFavourites
} from "../controllers/lists.controller.js";

const router = express.Router();

// Private routes
router.get("/favourites", authMiddleware, getFavourites);
router.post("/favourites", authMiddleware, addFavourite);
router.delete("/favourites", authMiddleware, removeFavourite);

// Public route
router.get("/favourites/public/:userId", getPublicFavourites);

export default router;