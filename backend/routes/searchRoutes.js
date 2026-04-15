import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import authorizeRoles from '../middlewares/authorizeRoles.js';
import { searchStudents } from '../controllers/searchController.js';

const router = express.Router();

router.get('/students', protect, authorizeRoles('recruiter', 'alumni'), searchStudents);

export default router;
