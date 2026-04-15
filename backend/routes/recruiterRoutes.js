import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import authorizeRoles from '../middlewares/authorizeRoles.js';
import {
  getProfile, updateProfile,
  getAllStudents, getStudentById,
  starStudent, unstarStudent, getStarredStudents,
} from '../controllers/recruiterController.js';

const router = express.Router();
router.use(protect, authorizeRoles('recruiter'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/students', getAllStudents);
router.get('/students/:studentId', getStudentById);
router.post('/star/:studentId', starStudent);
router.delete('/star/:studentId', unstarStudent);
router.get('/starred', getStarredStudents);

export default router;
