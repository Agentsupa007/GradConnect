import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import authorizeRoles from '../middlewares/authorizeRoles.js';
import {
  getProfile, updateProfile, updateSkills,
  addResume, deleteResume, activateResume,
  addProject, updateProject, deleteProject,
} from '../controllers/studentController.js';

const router = express.Router();
router.use(protect, authorizeRoles('student'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/skills', updateSkills);
router.post('/resumes', addResume);
router.delete('/resumes/:resumeId', deleteResume);
router.put('/resumes/:resumeId/activate', activateResume);
router.post('/projects', addProject);
router.put('/projects/:projectId', updateProject);
router.delete('/projects/:projectId', deleteProject);

export default router;
