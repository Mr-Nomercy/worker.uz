import { Router } from 'express';
import applicationController from '../controllers/application.controller';
import { authenticate, authorize, requireVerified } from '../middleware/auth.middleware';
import { UserRole } from '@prisma/client';

const router = Router();

// Apply for a job - Candidate only
router.post(
  '/',
  authenticate,
  authorize(UserRole.CANDIDATE),
  requireVerified,
  applicationController.apply
);

// Get my applications - Candidate only
router.get(
  '/my-applications',
  authenticate,
  authorize(UserRole.CANDIDATE),
  applicationController.getMyApplications
);

// Get applications for a job - Employer only
router.get(
  '/job/:jobId',
  authenticate,
  authorize(UserRole.EMPLOYER),
  requireVerified,
  applicationController.getJobApplications
);

// Update application status - Employer only
router.patch(
  '/:id/status',
  authenticate,
  authorize(UserRole.EMPLOYER),
  requireVerified,
  applicationController.updateStatus
);

// Withdraw application - Candidate only
router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.CANDIDATE),
  applicationController.withdraw
);

export default router;
