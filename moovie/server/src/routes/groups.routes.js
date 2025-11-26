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
} from '../controllers/groups.controller.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Create a new group (requires auth)
router.post('/', authMiddleware, createGroup);

// Get groups for current user
router.get('/mine', authMiddleware, getMyGroups);

// Public search / listing (optional query `q`)
router.get('/', searchGroups);

// Get group by id
router.get('/:id', getGroupById);

// Join request endpoints
router.post('/:id/join', authMiddleware, sendJoinRequest);
router.delete('/:id/join', authMiddleware, cancelJoinRequest);
router.get('/:id/join-status', authMiddleware, getJoinStatus);
// leave group
router.delete('/:id/leave', authMiddleware, leaveGroup);

// Admin: list pending requests
router.get('/:id/requests', authMiddleware, getPendingRequests);
router.post('/:id/requests/:userId/approve', authMiddleware, approveRequest);
router.post('/:id/requests/:userId/reject', authMiddleware, rejectRequest);

export default router;
