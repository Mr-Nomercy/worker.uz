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
      const { lang = 'uz' } = req.query;
      const candidateId = req.user!.id;

      // Get candidate profile
      const candidate = await prisma.user.findUnique({
        where: { id: candidateId },
        include: {
          profile: true,
        },
      });

      if (!candidate || !candidate.profile) {
        throw new AppError('Candidate profile not found', 404);
      }

      // Get job details
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
        throw new AppError('Job not found', 404);
      }

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

      // Get AI advice based on language
      const advice = lang === 'ru'
        ? await aiService.getRussianAdvice(candidateProfile, jobDetails)
        : await aiService.getSmartAdvice(candidateProfile, jobDetails);

      res.json(successResponse(advice));
    } catch (error) {
      next(error);
    }
  },
};

export default aiController;
