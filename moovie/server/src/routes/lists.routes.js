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

/**
 * @swagger
 * tags:
 *   name: Lists
 *   description: User favourite movies & custom lists
 */

/* -------------------------------------------------------------------------- */
/*                                FAVOURITES                                 */
/* -------------------------------------------------------------------------- */

/**
 * @swagger
 * /api/lists/favourites:
 *   get:
 *     summary: Get authenticated user's favourite movies
 *     tags: [Lists]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of favourite movies
 */
router.get("/favourites", authMiddleware, getFavourites);

/**
 * @swagger
 * /api/lists/favourites:
 *   post:
 *     summary: Add a movie to favourites
 *     tags: [Lists]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [movieId]
 *             properties:
 *               movieId:
 *                 type: integer
 *               movieName:
 *                 type: string
 *               posterUrl:
 *                 type: string
 *               releaseYear:
 *                 type: integer
 *               genre:
 *                 type: string
 *     responses:
 *       200:
 *         description: Added to favourites
 *       400:
 *         description: Missing movieId
 */
router.post("/favourites", authMiddleware, addFavourite);

/**
 * @swagger
 * /api/lists/favourites:
 *   delete:
 *     summary: Remove a movie from favourites
 *     tags: [Lists]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [movieId]
 *             properties:
 *               movieId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Movie removed
 *       404:
 *         description: Favourites not found
 */
router.delete("/favourites", authMiddleware, removeFavourite);


/**
 * @swagger
 * /api/lists/favourites/public/{userId}:
 *   get:
 *     summary: Get another user's public favourites list
 *     tags: [Lists]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Public favourites returned
 */

router.get("/favorites/public/:userId", getPublicFavourites);


/* -------------------------------------------------------------------------- */
/*                                CUSTOM LISTS                               */
/* -------------------------------------------------------------------------- */

/**
 * @swagger
 * /api/lists:
 *   post:
 *     summary: Create a new custom movie list
 *     tags: [Lists]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: List created
 *       400:
 *         description: Missing list name
 */
router.post("/", authMiddleware, createList);

/**
 * @swagger
 * /api/lists:
 *   get:
 *     summary: Get all custom lists for authenticated user (excluding Favourites)
 *     tags: [Lists]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of custom lists
 */
router.get("/", authMiddleware, getUserLists);

/**
 * @swagger
 * /api/lists/{listId}/movies:
 *   post:
 *     summary: Add a movie to a custom list
 *     tags: [Lists]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [movieId]
 *             properties:
 *               movieId:
 *                 type: integer
 *               movieName:
 *                 type: string
 *               posterUrl:
 *                 type: string
 *               releaseYear:
 *                 type: integer
 *               genre:
 *                 type: string
 *     responses:
 *       200:
 *         description: Movie added
 *       400:
 *         description: movieId missing
 */
router.post("/:listId/movies", authMiddleware, addMovieToList);

/**
 * @swagger
 * /api/lists/{listId}/movies:
 *   delete:
 *     summary: Remove a movie from a custom list
 *     tags: [Lists]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [movieId]
 *             properties:
 *               movieId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Movie removed
 */
router.delete("/:listId/movies", authMiddleware, removeMovieFromList);

/**
 * @swagger
 * /api/lists/{listId}:
 *   get:
 *     summary: Get all movies inside a specific custom list
 *     tags: [Lists]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of movies
 */
router.get("/:listId", authMiddleware, getListMovies);

export default router;
