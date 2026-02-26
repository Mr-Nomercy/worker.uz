import { Response, NextFunction } from 'express';
import { Prisma, UserRole } from '@prisma/client';
import prisma from '../utils/prisma';
import { successResponse, AppError, paginatedResponse } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth.middleware';

export const adminController = {
  /**
   * GET /api/admin/metrics
   * Optimized parallel database counts
   */
  async getMetrics(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const [
        totalCandidates,
        totalEmployers,
        totalJobs,
        activeJobs,
        closedJobs,
        totalApplications,
        acceptedApplications,
        rejectedApplications,
        pendingApplications,
        verifiedCompanies,
        pendingCompanies,
        totalInterviews,
        newCandidatesThisWeek,
        newJobsThisWeek,
        newApplicationsThisWeek,
      ] = await Promise.all([
        prisma.user.count({ where: { role: 'CANDIDATE' } }),
        prisma.user.count({ where: { role: 'EMPLOYER' } }),
        prisma.job.count(),
        prisma.job.count({ where: { status: 'OPEN' } }),
        prisma.job.count({ where: { status: 'CLOSED' } }),
        prisma.application.count(),
        prisma.application.count({ where: { status: 'ACCEPTED' } }),
        prisma.application.count({ where: { status: 'REJECTED' } }),
        prisma.application.count({ where: { status: 'PENDING' } }),
        prisma.company.count({ where: { isVerified: true } }),
        prisma.company.count({ where: { isVerified: false } }),
        prisma.interview.count(),
        prisma.user.count({
          where: { 
            role: 'CANDIDATE',
            createdAt: { gte: weekAgo },
          },
        }),
        prisma.job.count({
          where: { createdAt: { gte: weekAgo } },
        }),
        prisma.application.count({
          where: { appliedAt: { gte: weekAgo } },
        }),
      ]);

      const matchRate = totalApplications > 0 
        ? Math.round((acceptedApplications / totalApplications) * 100) 
        : 0;

      const interviewRate = totalApplications > 0
        ? Math.round((totalInterviews / totalApplications) * 100)
        : 0;

      res.json(successResponse({
        totalCandidates,
        totalEmployers,
        totalJobs,
        activeJobs,
        closedJobs,
        totalApplications,
        acceptedApplications,
        rejectedApplications,
        pendingApplications,
        verifiedCompanies,
        pendingCompanies,
        totalInterviews,
        matchRate,
        interviewRate,
        weeklyTrends: {
          newCandidates: newCandidatesThisWeek,
          newJobs: newJobsThisWeek,
          newApplications: newApplicationsThisWeek,
        },
      }));
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/admin/audit-logs
   * Paginated audit logs
   */
  async getAuditLogs(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 20, action, entityType, userId } = req.query;
      const pageNum = Number(page);
      const limitNum = Number(limit);
      const skip = (pageNum - 1) * limitNum;

      const where: Prisma.AuditLogWhereInput = {};

      if (action) {
        where.action = { contains: action as string, mode: 'insensitive' };
      }

      if (entityType) {
        where.entityType = entityType as string;
      }

      if (userId) {
        where.userId = userId as string;
      }

      const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
          },
          skip,
          take: limitNum,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.auditLog.count({ where }),
      ]);

      res.json(paginatedResponse(logs, pageNum, limitNum, total));
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/admin/companies
   * Companies with verification status
   */
  async getCompanies(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { verified, page = 1, limit = 20 } = req.query;
      const pageNum = Number(page);
      const limitNum = Number(limit);
      const skip = (pageNum - 1) * limitNum;

      const where: Prisma.CompanyWhereInput = {};
      if (verified !== undefined) {
        where.isVerified = verified === 'true';
      }

      const [companies, total] = await Promise.all([
        prisma.company.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                email: true,
                createdAt: true,
              },
            },
            _count: {
              select: { jobs: true },
            },
          },
          skip,
          take: limitNum,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.company.count({ where }),
      ]);

      res.json(paginatedResponse(companies, pageNum, limitNum, total));
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/admin/companies/:id/verify
   * Verify or reject company
   */
  async verifyCompany(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const adminId = req.user!.id;
      const { id } = req.params;
      const { verified } = req.body;

      const company = await prisma.company.findUnique({
        where: { id },
        include: { user: true },
      });

      if (!company) {
        throw new AppError('Company not found', 404);
      }

      const [updatedCompany] = await Promise.all([
        prisma.company.update({
          where: { id },
          data: {
            isVerified: verified,
            verifiedAt: verified ? new Date() : null,
          },
        }),
        prisma.user.update({
          where: { id: company.userId },
          data: { isVerified: verified },
        }),
        prisma.notification.create({
          data: {
            userId: company.userId,
            title: verified ? 'Company Verified' : 'Company Rejected',
            message: verified
              ? 'Your company has been verified and can now post jobs.'
              : 'Your company verification was rejected.',
            type: verified ? 'success' : 'error',
          },
        }),
        prisma.auditLog.create({
          data: {
            userId: adminId,
            action: verified ? 'VERIFY_COMPANY' : 'REJECT_COMPANY',
            entityType: 'COMPANY',
            entityId: id,
            details: { companyName: company.name },
            ipAddress: req.ip || 'unknown',
          },
        }),
      ]);

      res.json(successResponse(
        updatedCompany,
        verified ? 'Company verified successfully' : 'Company rejected'
      ));
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/admin/ai-config
   */
  async getAIConfig(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const config = await prisma.aIConfig.findUnique({
        where: { id: 'default' },
      });

      if (!config) {
        throw new AppError('AI configuration not found', 404);
      }

      res.json(successResponse(config));
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/admin/ai-config
   */
  async updateAIConfig(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const adminId = req.user!.id;
      const { matchSensitivity, minMatchScore, maxCandidatesPerJob, automatedVerification, modelVersion } = req.body;

      const config = await prisma.aIConfig.update({
        where: { id: 'default' },
        data: {
          ...(matchSensitivity !== undefined && { matchSensitivity }),
          ...(minMatchScore !== undefined && { minMatchScore }),
          ...(maxCandidatesPerJob !== undefined && { maxCandidatesPerJob }),
          ...(automatedVerification !== undefined && { automatedVerification }),
          ...(modelVersion && { modelVersion }),
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: adminId,
          action: 'UPDATE_AI_CONFIG',
          entityType: 'AI_CONFIG',
          entityId: 'default',
          details: { updatedFields: req.body },
          ipAddress: req.ip || 'unknown',
        },
      });

      res.json(successResponse(config, 'AI configuration updated'));
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/admin/users
   */
  async getUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { role, verified, page = 1, limit = 20 } = req.query;
      const pageNum = Number(page);
      const limitNum = Number(limit);
      const skip = (pageNum - 1) * limitNum;

      const where: Prisma.UserWhereInput = {};
      if (role) where.role = role as UserRole;
      if (verified !== undefined) where.isVerified = verified === 'true';

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          select: {
            id: true,
            email: true,
            role: true,
            isVerified: true,
            createdAt: true,
            profile: { select: { fullName: true } },
            company: { select: { name: true, isVerified: true } },
          },
          skip,
          take: limitNum,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count({ where }),
      ]);

      res.json(paginatedResponse(users, pageNum, limitNum, total));
    } catch (error) {
      next(error);
    }
  },
};

export default adminController;
