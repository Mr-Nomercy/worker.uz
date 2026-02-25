import { Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { successResponse, AppError } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth.middleware';
import { ApplicationStatus } from '@prisma/client';
import matchingService from '../services/matching.service';

export const applicationController = {
  /**
   * POST /api/applications
   * Apply for a job (Candidate only)
   */
  async apply(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const candidateId = req.user!.id;
      const { jobId, coverLetter } = req.body;

      // Check if job exists
      const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: {
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!job) {
        throw new AppError('Job not found', 404);
      }

      if (job.status !== 'OPEN') {
        throw new AppError('This job is not accepting applications', 400);
      }

      // Check if already applied
      const existingApplication = await prisma.application.findUnique({
        where: {
          jobId_candidateId: {
            jobId,
            candidateId,
          },
        },
      });

      if (existingApplication) {
        throw new AppError('You have already applied for this job', 400);
      }

      // Calculate match score
      const matchResult = await matchingService.calculateMatchScore(jobId, candidateId);

      // Create application
      const application = await prisma.application.create({
        data: {
          jobId,
          candidateId,
          coverLetter,
          status: ApplicationStatus.PENDING,
          matchScore: matchResult.score,
        },
        include: {
          job: {
            include: {
              company: {
                select: {
                  id: true,
                  name: true,
                  industry: true,
                },
              },
            },
          },
        },
      });

      // Log the action
      await prisma.auditLog.create({
        data: {
          userId: candidateId,
          action: 'APPLY_JOB',
          entityType: 'APPLICATION',
          entityId: application.id,
          details: { jobTitle: job.title, company: job.company.name },
          ipAddress: req.ip || 'unknown',
        },
      });

      // Create notification for employer
      const employer = await prisma.user.findFirst({
        where: {
          company: {
            id: job.companyId,
          },
        },
      });

      if (employer) {
        await prisma.notification.create({
          data: {
            userId: employer.id,
            title: 'New Application',
            message: `You received a new application for ${job.title}`,
            type: 'info',
          },
        });
      }

      res.status(201).json(successResponse(application, 'Application submitted successfully'));
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/applications/my-applications
   * Get candidate's applications
   */
  async getMyApplications(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const candidateId = req.user!.id;
      const { status } = req.query;

      const where: any = { candidateId };
      if (status) {
        where.status = status;
      }

      const applications = await prisma.application.findMany({
        where,
        include: {
          job: {
            include: {
              company: {
                select: {
                  id: true,
                  name: true,
                  logoUrl: true,
                  industry: true,
                },
              },
            },
          },
        },
        orderBy: { appliedAt: 'desc' },
      });

      res.json(successResponse(applications));
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/applications/job/:jobId
   * Get applications for a specific job (Employer only)
   */
  async getJobApplications(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const employerId = req.user!.id;
      const { jobId } = req.params;

      // Verify job belongs to employer
      const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: { company: true },
      });

      if (!job) {
        throw new AppError('Job not found', 404);
      }

      if (job.company.userId !== employerId) {
        throw new AppError('Not authorized to view applications for this job', 403);
      }

      const applications = await prisma.application.findMany({
        where: { jobId },
        include: {
          candidate: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: { matchScore: 'desc' },
      });

      res.json(successResponse(applications));
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/applications/:id/status
   * Update application status (Employer only)
   */
  async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const employerId = req.user!.id;
      const { id } = req.params;
      const { status, notes } = req.body;

      const application = await prisma.application.findUnique({
        where: { id },
        include: {
          job: {
            include: { company: true },
          },
        },
      });

      if (!application) {
        throw new AppError('Application not found', 404);
      }

      if (application.job.company.userId !== employerId) {
        throw new AppError('Not authorized to update this application', 403);
      }

      const updatedApplication = await prisma.application.update({
        where: { id },
        data: {
          status: status as ApplicationStatus,
          ...(notes && { notes }),
        },
        include: {
          job: {
            include: {
              company: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          candidate: {
            include: {
              profile: true,
            },
          },
        },
      });

      // Create notification for candidate
      await prisma.notification.create({
        data: {
          userId: application.candidateId,
          title: 'Application Update',
          message: `Your application for ${application.job.title} has been ${status}`,
          type: status === 'REJECTED' ? 'error' : 'info',
        },
      });

      // Log the action
      await prisma.auditLog.create({
        data: {
          userId: employerId,
          action: 'UPDATE_APPLICATION_STATUS',
          entityType: 'APPLICATION',
          entityId: id,
          details: { newStatus: status, candidateId: application.candidateId },
          ipAddress: req.ip || 'unknown',
        },
      });

      res.json(successResponse(updatedApplication, 'Application status updated'));
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/applications/:id
   * Withdraw application (Candidate only)
   */
  async withdraw(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const candidateId = req.user!.id;
      const { id } = req.params;

      const application = await prisma.application.findUnique({
        where: { id },
      });

      if (!application) {
        throw new AppError('Application not found', 404);
      }

      if (application.candidateId !== candidateId) {
        throw new AppError('Not authorized to withdraw this application', 403);
      }

      await prisma.application.update({
        where: { id },
        data: { status: ApplicationStatus.WITHDRAWN },
      });

      res.json(successResponse(null, 'Application withdrawn'));
    } catch (error) {
      next(error);
    }
  },
};

export default applicationController;
