import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
    getFavourites,
    addFavourite,
    removeFavourite,
    getPublicFavourites,
    createList,
    getUserLists,
    addMovieToList,
    removeMovieFromList,
    getListMovies
} from "../controllers/lists.controller.js";

const router = express.Router();

// Private routes
router.get("/favourites", authMiddleware, getFavourites);
router.post("/favourites", authMiddleware, addFavourite);
router.delete("/favourites", authMiddleware, removeFavourite);

// Public route
router.get("/favourites/public/:userId", getPublicFavourites); 

// Custom List Routes
router.post("/", authMiddleware, createList); // Create a new custom list
router.get("/", authMiddleware, getUserLists); // Get all user lists, except Favourites
router.post("/:listId/movies", authMiddleware, addMovieToList);
router.delete("/:listId/movies", authMiddleware, removeMovieFromList);
router.get("/:listId", authMiddleware, getListMovies); // Get movies in one custom list



export default router;