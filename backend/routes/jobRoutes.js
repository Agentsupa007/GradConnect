import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import authorizeRoles from '../middlewares/authorizeRoles.js';
import {
  createJob, getMyJobs, getJobById, updateJob, deleteJob,
  getJobApplications, advanceApplication, rejectApplication, selectApplication,
} from '../controllers/jobController.js';

const router = express.Router();
router.use(protect, authorizeRoles('recruiter'));

router.post('/', createJob);
router.get('/', getMyJobs);
router.get('/:jobId', getJobById);
router.put('/:jobId', updateJob);
router.delete('/:jobId', deleteJob);
router.get('/:jobId/applications', getJobApplications);
router.put('/:jobId/applications/:appId/advance', advanceApplication);
router.put('/:jobId/applications/:appId/reject', rejectApplication);
router.put('/:jobId/applications/:appId/select', selectApplication);

export default router;
