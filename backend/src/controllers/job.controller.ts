import { Response, NextFunction } from 'express';
import { Prisma, JobStatus } from '@prisma/client';
import prisma from '../utils/prisma';
import { successResponse, AppError, paginatedResponse } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth.middleware';

export const jobController = {
  /**
   * GET /api/jobs
   * Get all jobs (with filters)
   */
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        page = 1,
        limit = 10,
        location,
        industry,
        status = 'OPEN',
        search,
      } = req.query;

      const pageNum = Number(page);
      const limitNum = Number(limit);
      const skip = (pageNum - 1) * limitNum;

      const where: Prisma.JobWhereInput = {
        status: status as JobStatus,
      };

      if (location) {
        where.location = { contains: location as string, mode: 'insensitive' };
      }

      if (industry) {
        where.company = { industry: { contains: industry as string, mode: 'insensitive' } };
      }

      if (search) {
        where.OR = [
          { title: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      const [jobs, total] = await Promise.all([
        prisma.job.findMany({
          where,
          include: {
            company: {
              select: {
                id: true,
                name: true,
                industry: true,
                logoUrl: true,
                isVerified: true,
              },
            },
            _count: {
              select: { applications: true },
            },
          },
          skip: skip,
          take: limitNum,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.job.count({ where }),
      ]);

      res.json(paginatedResponse(jobs, pageNum, limitNum, total));
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/jobs/:id
   * Get single job by ID
   */
  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const job = await prisma.job.findUnique({
        where: { id },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              industry: true,
              website: true,
              description: true,
              logoUrl: true,
              isVerified: true,
              verifiedAt: true,
            },
          },
          _count: {
            select: { applications: true },
          },
        },
      });

      if (!job) {
        throw new AppError('Job not found', 404);
      }

      res.json(successResponse(job));
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/jobs
   * Create a new job (Employer only)
   */
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const employerId = req.user!.id;

      // Get employer's company
      const employer = await prisma.user.findUnique({
        where: { id: employerId },
        include: { company: true },
      });

      if (!employer?.company) {
        throw new AppError('Company not found. Please complete company profile.', 400);
      }

      if (!employer.company.isVerified) {
        throw new AppError('Company must be verified to post jobs', 403);
      }

      const {
        title,
        description,
        requirements,
        salaryMin,
        salaryMax,
        currency,
        location,
        jobType,
      } = req.body;

      const job = await prisma.job.create({
        data: {
          companyId: employer.company.id,
          title,
          description,
          requirements: requirements || [],
          salaryMin: salaryMin || null,
          salaryMax: salaryMax || null,
          currency: currency || 'UZS',
          location,
          jobType: jobType || 'full-time',
          status: JobStatus.OPEN,
        },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              industry: true,
            },
          },
        },
      });

      // Log the action
      await prisma.auditLog.create({
        data: {
          userId: employerId,
          action: 'CREATE_JOB',
          entityType: 'JOB',
          entityId: job.id,
          details: { title: job.title, company: employer.company.name },
          ipAddress: req.ip || 'unknown',
        },
      });

      res.status(201).json(successResponse(job, 'Job created successfully'));
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/jobs/:id
   * Update a job (Employer only, own jobs)
   */
  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const employerId = req.user!.id;

      const existingJob = await prisma.job.findUnique({
        where: { id },
        include: { company: true },
      });

      if (!existingJob) {
        throw new AppError('Job not found', 404);
      }

      if (existingJob.company.userId !== employerId) {
        throw new AppError('Not authorized to update this job', 403);
      }

      const {
        title,
        description,
        requirements,
        salaryMin,
        salaryMax,
        location,
        jobType,
        status,
      } = req.body;

      const job = await prisma.job.update({
        where: { id },
        data: {
          ...(title && { title }),
          ...(description && { description }),
          ...(requirements && { requirements }),
          ...(salaryMin !== undefined && { salaryMin }),
          ...(salaryMax !== undefined && { salaryMax }),
          ...(location && { location }),
          ...(jobType && { jobType }),
          ...(status && { status: status as JobStatus }),
        },
        include: {
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      res.json(successResponse(job, 'Job updated successfully'));
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/jobs/:id
   * Delete a job (Employer only, own jobs)
   */
  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const employerId = req.user!.id;

      const existingJob = await prisma.job.findUnique({
        where: { id },
        include: { company: true },
      });

      if (!existingJob) {
        throw new AppError('Job not found', 404);
      }

      if (existingJob.company.userId !== employerId) {
        throw new AppError('Not authorized to delete this job', 403);
      }

      await prisma.job.delete({ where: { id } });

      // Log the action
      await prisma.auditLog.create({
        data: {
          userId: employerId,
          action: 'DELETE_JOB',
          entityType: 'JOB',
          entityId: id,
          details: { title: existingJob.title },
          ipAddress: req.ip || 'unknown',
        },
      });

      res.json(successResponse(null, 'Job deleted successfully'));
    } catch (error) {
      next(error);
    }
  },
};

export default jobController;
