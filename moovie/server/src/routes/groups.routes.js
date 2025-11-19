import express from 'express';
import { createGroup, getGroupById, getMyGroups, searchGroups } from '../controllers/groups.controller.js';
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

export default router;
