import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import authorizeRoles from '../middlewares/authorizeRoles.js';
import {
  getProfile, updateProfile, updateSkills,
  addResume, deleteResume, activateResume,
  addProject, updateProject, deleteProject,
  starStudent, unstarStudent, getStarredStudents,
} from '../controllers/studentController.js';
import {
  getOpenJobs, applyToJob, getMyApplications, getPlacements, getMentors,
} from '../controllers/applicationController.js';

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

router.get('/starred', getStarredStudents);
router.post('/star/:studentId', starStudent);
router.delete('/star/:studentId', unstarStudent);

router.get('/jobs', getOpenJobs);
router.post('/jobs/:jobId/apply', applyToJob);
router.get('/applications', getMyApplications);
router.get('/placements', getPlacements);
router.get('/mentors', getMentors);

export default router;
