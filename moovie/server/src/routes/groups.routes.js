// server/src/routes/groups.routes.js
import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  createGroup,
  getGroupById,
  getMyGroups,
  searchGroups,
  sendJoinRequest,
  cancelJoinRequest,
  getJoinStatus,
  getPendingRequests,
  approveRequest,
  rejectRequest,
  leaveGroup,
  removeMember,
  deleteGroup,
  getGroupMovies,
  addMovieToGroup,
} from "../controllers/groups.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Groups
 *   description: Group management & membership endpoints
 */

/**
 * @swagger
 * /api/groups:
 *   post:
 *     summary: Create a new group
 *     tags: [Groups]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Horror Lovers
 *               banner_url:
 *                 type: string
 *               icon_url:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Group created
 *       400:
 *         description: Invalid or missing name
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/", authMiddleware, createGroup);

/**
 * @swagger
 * /api/groups/mine:
 *   get:
 *     summary: Get groups where current user is a member
 *     tags: [Groups]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of groups
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/mine", authMiddleware, getMyGroups);

/**
 * @swagger
 * /api/groups:
 *   get:
 *     summary: Public search for groups
 *     tags: [Groups]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Query string
 *     responses:
 *       200:
 *         description: List of matching or recent groups
 *       500:
 *         description: Internal server error
 */
router.get("/", searchGroups);

/**
 * @swagger
 * /api/groups/{id}:
 *   get:
 *     summary: Get group details
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Group details
 *       404:
 *         description: Group not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getGroupById);

/**
 * @swagger
 * /api/groups/{id}:
 *   delete:
 *     summary: Delete group (admin only)
 *     tags: [Groups]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Group deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *       404:
 *         description: Group not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authMiddleware, deleteGroup);

/**
 * @swagger
 * /api/groups/{id}/movies:
 *   get:
 *     summary: Get movies added to a group
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: List of movies
 *       400:
 *         description: Invalid group id
 *       500:
 *         description: Internal server error
 */
router.get("/:id/movies", getGroupMovies);

/**
 * @swagger
 * /api/groups/{id}/join:
 *   post:
 *     summary: Send a join request
 *     tags: [Groups]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Request pending or already applied
 *       400:
 *         description: Already a member
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Group not found
 *       500:
 *         description: Internal server error
 */
router.post("/:id/join", authMiddleware, sendJoinRequest);

/**
 * @swagger
 * /api/groups/{id}/join:
 *   delete:
 *     summary: Cancel pending join request
 *     tags: [Groups]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Request canceled
 *       400:
 *         description: No pending request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete("/:id/join", authMiddleware, cancelJoinRequest);

/**
 * @swagger
 * /api/groups/{id}/join-status:
 *   get:
 *     summary: Get current user's join status
 *     tags: [Groups]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Status: admin | member | pending | not_member
 *       500:
 *         description: Internal server error
 */
router.get("/:id/join-status", authMiddleware, getJoinStatus);

/**
 * @swagger
 * /api/groups/{id}/leave:
 *   delete:
 *     summary: Leave group (non-admin)
 *     tags: [Groups]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Left group
 *       400:
 *         description: Not a member / admin cannot leave
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete("/:id/leave", authMiddleware, leaveGroup);

/**
 * @swagger
 * /api/groups/{id}/requests:
 *   get:
 *     summary: Get pending requests (admin only)
 *     tags: [Groups]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Pending requests
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get("/:id/requests", authMiddleware, getPendingRequests);

/**
 * @swagger
 * /api/groups/{id}/requests/{userId}/approve:
 *   post:
 *     summary: Approve join request (admin only)
 *     tags: [Groups]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User added as member
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.post("/:id/requests/:userId/approve", authMiddleware, approveRequest);

/**
 * @swagger
 * /api/groups/{id}/requests/{userId}/reject:
 *   post:
 *     summary: Reject join request (admin only)
 *     tags: [Groups]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Request rejected
 *       400:
 *         description: No such request / already member
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.post("/:id/requests/:userId/reject", authMiddleware, rejectRequest);

/**
 * @swagger
 * /api/groups/{id}/members/{userId}:
 *   delete:
 *     summary: Remove a member (admin only)
 *     tags: [Groups]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Member removed
 *       400:
 *         description: Admin cannot remove themselves / user not member / cannot remove admin
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.delete("/:id/members/:userId", authMiddleware, removeMember);

/**
 * @swagger
 * /api/groups/{id}/movies:
 *   post:
 *     summary: Add movie to group
 *     tags: [Groups]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movieId
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
 *         description: Movie added (duplicate ignored)
 *       400:
 *         description: movieId or groupId missing
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not a group member
 *       404:
 *         description: Group not found
 *       500:
 *         description: Internal server error
 */
router.post("/:id/movies", authMiddleware, addMovieToGroup);

export default router;
