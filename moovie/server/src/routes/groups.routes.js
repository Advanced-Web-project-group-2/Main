import express from 'express';
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

} from '../controllers/groups.controller.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Groups
 *   description: Group management & membership
 */

/**
 * @swagger
 * /api/groups:
 *   post:
 *     summary: Create a new group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Horror Lovers
 *               banner_url:
 *                 type: string
 *               icon_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Group successfully created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, createGroup);

/**
 * @swagger
 * /api/groups/mine:
 *   get:
 *     summary: Get groups where the authenticated user is a member
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of groups
 *       401:
 *         description: Unauthorized
 */
router.get('/mine', authMiddleware, getMyGroups);

/**
 * @swagger
 * /api/groups:
 *   get:
 *     summary: Search groups (public)
 *     tags: [Groups]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search term
 *     responses:
 *       200:
 *         description: List of groups
 */
router.get('/', searchGroups);

/**
 * @swagger
 * /api/groups/{id}:
 *   get:
 *     summary: Get group details (members + pending requests)
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Group found
 *       404:
 *         description: Group not found
 */
router.get('/:id', getGroupById);

// Admin: delete group
router.delete('/:id', authMiddleware, deleteGroup);

// Get movies added to this group
/**
 * @swagger
 * /api/groups/{id}/movies:
 *   get:
 *     summary: Get movies added to the group
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Movies list
 */
router.get('/:id/movies', getGroupMovies);

/**
 * @swagger
 * /api/groups/{id}/join:
 *   post:
 *     summary: Send join request
 *     security:
 *       - bearerAuth: []
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Join request sent
 *       400:
 *         description: Already member or invalid
 *       401:
 *         description: Unauthorized
 */
router.post('/:id/join', authMiddleware, sendJoinRequest);

/**
 * @swagger
 * /api/groups/{id}/join:
 *   delete:
 *     summary: Cancel pending join request
 *     security:
 *       - bearerAuth: []
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Join request canceled
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id/join', authMiddleware, cancelJoinRequest);

/**
 * @swagger
 * /api/groups/{id}/join-status:
 *   get:
 *     summary: Check current user's status in a group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Status returned
 */
router.get('/:id/join-status', authMiddleware, getJoinStatus);

/**
 * @swagger
 * /api/groups/{id}/leave:
 *   delete:
 *     summary: Leave a group (non-admin only)
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Left group
 *       400:
 *         description: Cannot leave if admin
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id/leave', authMiddleware, leaveGroup);

/**
 * @swagger
 * /api/groups/{id}/requests:
 *   get:
 *     summary: Get pending join requests (admin only)
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pending requests
 *       403:
 *         description: Admin only
 */
router.get('/:id/requests', authMiddleware, getPendingRequests);

/**
 * @swagger
 * /api/groups/{id}/requests/{userId}/approve:
 *   post:
 *     summary: Approve user's join request (admin only)
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
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
 *         description: Request approved
 *       403:
 *         description: Admin only
 */
router.post('/:id/requests/:userId/approve', authMiddleware, approveRequest);

/**
 * @swagger
 * /api/groups/{id}/requests/{userId}/reject:
 *   post:
 *     summary: Reject user's join request (admin only)
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
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
 *       403:
 *         description: Admin only
 */
router.post('/:id/requests/:userId/reject', authMiddleware, rejectRequest);

/**
 * @swagger
 * /api/groups/{id}/members/{userId}:
 *   delete:
 *     summary: Remove a member from the group (admin only)
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
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
 *         description: Member removed
 *       403:
 *         description: Admin only
 */
router.delete('/:id/members/:userId', authMiddleware, removeMember);

/**
 * @swagger
 * /api/groups/{id}/movies:
 *   post:
 *     summary: Add a movie to the group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
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
 *       403:
 *         description: Not a group member
 */
router.post('/:id/movies', authMiddleware, addMovieToGroup);

export default router;
