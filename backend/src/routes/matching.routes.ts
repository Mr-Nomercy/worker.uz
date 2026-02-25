import { Router } from 'express';
import { authenticate, authorize, requireVerified } from '../middleware/auth.middleware';
import { UserRole } from '@prisma/client';
import matchingService from '../services/matching.service';
import { successResponse } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// Get job matches for a candidate - Candidate only
router.get(
  '/jobs',
  authenticate,
  authorize(UserRole.CANDIDATE),
  requireVerified,
  async (req: AuthRequest, res, next) => {
    try {
      const candidateId = req.user!.id;
      const matches = await matchingService.matchJobsToCandidate(candidateId);
      res.json(successResponse(matches));
    } catch (error) {
      next(error);
    }
  }
);

// Get candidate matches for a job - Employer only
router.get(
  '/candidates/:jobId',
  authenticate,
  authorize(UserRole.EMPLOYER),
  requireVerified,
  async (req: AuthRequest, res, next) => {
    try {
      const { jobId } = req.params;
      const matches = await matchingService.matchCandidatesToJob(jobId);
      res.json(successResponse(matches));
    } catch (error) {
      next(error);
    }
  }
);

export default router;
