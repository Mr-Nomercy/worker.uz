import { Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { successResponse, AppError } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth.middleware';
import aiService from '../services/ai.service';

export const aiController = {
  /**
   * GET /api/matching/ai-advice/:jobId
   * Get AI-powered career advice for a specific job
   */
  async getAIAdvice(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { jobId } = req.params;
      const candidateId = req.user!.id;

      // Fetch candidate profile from PostgreSQL
      const candidate = await prisma.user.findUnique({
        where: { id: candidateId },
        include: {
          profile: true,
        },
      });

      if (!candidate || !candidate.profile) {
        throw new AppError('Nomzod profili topilmadi', 404);
      }

      // Fetch job details from PostgreSQL
      const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: {
          company: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!job) {
        throw new AppError('Bo\'sh ish o\'rni topilmadi', 404);
      }

      // Check if candidate already applied
      const existingApplication = await prisma.application.findUnique({
        where: {
          jobId_candidateId: {
            jobId,
            candidateId,
          },
        },
      });

      // Prepare data for AI
      const candidateProfile = {
        fullName: candidate.profile.fullName,
        softSkills: candidate.profile.softSkills || [],
        workHistory: (candidate.profile.workHistory as any[]) || [],
        educationHistory: (candidate.profile.educationHistory as any[]) || [],
      };

      const jobDetails = {
        title: job.title,
        company: {
          name: job.company.name,
        },
        requirements: job.requirements || [],
        description: job.description,
      };

      // Get AI advice
      const advice = await aiService.getSmartAdvice(candidateProfile, jobDetails);

      // Return response with additional metadata
      res.json(successResponse({
        ...advice,
        candidate: {
          name: candidate.profile.fullName,
        },
        job: {
          title: job.title,
          company: job.company.name,
        },
        hasApplied: !!existingApplication,
      }));
    } catch (error) {
      console.error('AI Advice Error:', error);
      next(error);
    }
  },
};

export default aiController;
