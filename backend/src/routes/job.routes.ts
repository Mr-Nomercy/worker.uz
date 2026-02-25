import { Router } from 'express';
import jobController from '../controllers/job.controller';
import { authenticate, authorize, requireVerified } from '../middleware/auth.middleware';
import { UserRole } from '@prisma/client';

const router = Router();

// Public routes
router.get('/', authenticate, jobController.getAll);
router.get('/:id', authenticate, jobController.getById);

// Protected routes - Employer only
router.post(
  '/',
  authenticate,
  authorize(UserRole.EMPLOYER),
  requireVerified,
  jobController.create
);

router.patch(
  '/:id',
  authenticate,
  authorize(UserRole.EMPLOYER),
  requireVerified,
  jobController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.EMPLOYER),
  requireVerified,
  jobController.delete
);

export default router;
