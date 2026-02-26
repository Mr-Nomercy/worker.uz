import { Router } from 'express';
import { authenticate, authorize, requireVerified } from '../middleware/auth.middleware';
import { UserRole } from '@prisma/client';
import matchingService from '../services/matching.service';
import { successResponse, AppError } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../utils/prisma';
import { createAuditLogFromRequest, AuditActions } from '../utils/auditLog';

const router = Router();

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

/**
 * PUBLIC SEARCH RESULTS - Field Masking Applied
 * Only returns non-sensitive, public-safe fields
 */
router.get(
  '/search-candidates',
  authenticate,
  authorize(UserRole.EMPLOYER),
  async (req: AuthRequest, res, next) => {
    try {
      const { 
        skills, 
        location, 
        verifiedOnly = 'false',
        page = '1', 
        limit = '20',
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;
      const verifiedOnlyBool = verifiedOnly === 'true';

      const whereClause: any = {
        role: 'CANDIDATE',
      };

      if (skills) {
        const skillList = (skills as string).split(',').map(s => s.trim());
        whereClause.profile = {
          softSkills: { hasSome: skillList }
        };
      }

      if (location) {
        whereClause.profile = {
          ...whereClause.profile,
          address: { contains: location as string, mode: 'insensitive' }
        };
      }

      if (verifiedOnlyBool) {
        whereClause.isVerified = true;
      }

      const [candidates, total] = await Promise.all([
        prisma.user.findMany({
          where: whereClause,
          select: {
            id: true,
            isVerified: true,
            createdAt: true,
            profile: {
              select: {
                fullName: true,
                softSkills: true,
                educationHistory: true,
                workHistory: true,
                cvUrl: true,
              }
            },
          },
          skip,
          take: limitNum,
          orderBy: [
            { isVerified: 'desc' },
            { createdAt: 'desc' }
          ],
        }),
        prisma.user.count({ where: whereClause })
      ]);

      const sanitizedCandidates = candidates.map((candidate: any) => {
        const profile = candidate.profile || {};
        const matchScore = profile.softSkills?.length 
          ? Math.min(100, profile.softSkills.length * 20) 
          : 0;
        
        return {
          id: candidate.id,
          isVerified: candidate.isVerified,
          createdAt: candidate.createdAt,
          fullName: profile.fullName || 'Unknown',
          skills: profile.softSkills || [],
          education: (profile.educationHistory || []).filter((e: any) => e.verified),
          experience: (profile.workHistory || []).filter((w: any) => w.verified),
          hasCV: !!profile.cvUrl,
          matchScore,
        };
      });

      res.json(successResponse({
        candidates: sanitizedCandidates,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum)
        }
      }));

      await createAuditLogFromRequest(
        req,
        AuditActions.SEARCH_CANDIDATES,
        'SEARCH',
        `page:${pageNum},skills:${skills || 'none'},verified:${verifiedOnlyBool}`,
        { resultsCount: total, filters: { skills, location, verifiedOnly: verifiedOnlyBool } }
      );
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PROTECTED ENDPOINT - Get Contact Details
 * Only accessible if employer has an active application/interview
 */
router.get(
  '/candidate-contact/:candidateId',
  authenticate,
  authorize(UserRole.EMPLOYER),
  requireVerified,
  async (req: AuthRequest, res, next) => {
    try {
      const employerId = req.user!.id;
      const { candidateId } = req.params;

      const employer = await prisma.user.findFirst({
        where: { id: employerId, role: 'EMPLOYER' },
        include: { company: true }
      });

      if (!employer?.company) {
        throw new AppError('Kompaniya topilmadi', 404);
      }

      const companyId = employer.company.id;

      const hasActiveApplication = await prisma.application.findFirst({
        where: {
          candidateId,
          job: { companyId },
          status: { in: ['PENDING', 'REVIEWING', 'INTERVIEW'] }
        }
      });

      if (!hasActiveApplication) {
        throw new AppError('Bu nomzod bilan bog\'lanish uchun avval ariza yuboring yoki suhbat belgilang.', 403);
      }

      const candidate = await prisma.user.findUnique({
        where: { id: candidateId },
        select: {
          id: true,
          isVerified: true,
          profile: {
            select: {
              fullName: true,
              phoneNumber: true,
              softSkills: true,
              portfolioLinks: true,
              cvUrl: true,
            }
          }
        }
      });

      if (!candidate?.profile) {
        throw new AppError('Nomzod topilmadi', 404);
      }

      res.json(successResponse({
        candidateId: candidate.id,
        isVerified: candidate.isVerified,
        contact: {
          fullName: candidate.profile.fullName,
          phoneNumber: candidate.profile.phoneNumber,
          skills: candidate.profile.softSkills,
          portfolioLinks: candidate.profile.portfolioLinks,
          cvUrl: candidate.profile.cvUrl,
        },
        note: 'Bu ma\'lumotlar faqat ariza qabul qilingan nomzodlar uchun ko\'rinadi.'
      }));
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PROTECTED ENDPOINT - Get Contact Details via Contact Request
 * Only accessible if employer has an ACCEPTED contact request
 */
router.get(
  '/candidate-contact-by-request/:candidateId',
  authenticate,
  authorize(UserRole.EMPLOYER),
  async (req: AuthRequest, res, next) => {
    try {
      const employerId = req.user!.id;
      const { candidateId } = req.params;

      const acceptedRequest = await prisma.contactRequest.findFirst({
        where: {
          employerId,
          candidateId,
          status: 'ACCEPTED'
        }
      });

      if (!acceptedRequest) {
        return res.json(successResponse({
          hasAccess: false,
          message: 'Bu nomzodning kontaktlarini ko\'rish uchun avval so\'rov yuboring va u tasdiqlansin.'
        }));
      }

      const candidate = await prisma.user.findUnique({
        where: { id: candidateId },
        select: {
          id: true,
          isVerified: true,
          profile: {
            select: {
              fullName: true,
              phoneNumber: true,
              softSkills: true,
              portfolioLinks: true,
              cvUrl: true,
            }
          }
        }
      });

      if (!candidate?.profile) {
        throw new AppError('Nomzod topilmadi', 404);
      }

      res.json(successResponse({
        hasAccess: true,
        candidateId: candidate.id,
        isVerified: candidate.isVerified,
        contact: {
          fullName: candidate.profile.fullName,
          phoneNumber: candidate.profile.phoneNumber,
          skills: candidate.profile.softSkills,
          portfolioLinks: candidate.profile.portfolioLinks,
          cvUrl: candidate.profile.cvUrl,
        },
        note: 'Bu ma\'lumotlar faqat tasdiqlangan so\'rov orqali ko\'rinadi.'
      }));

      await createAuditLogFromRequest(
        req,
        AuditActions.REVEAL_PHONE,
        'CANDIDATE',
        candidateId,
        { candidateName: candidate.profile.fullName }
      );
    } catch (error) {
      next(error);
    }
  }
);

/**
 * REQUEST CONTACT - Employer requests to see candidate's contact info
 */
router.post(
  '/request/:candidateId',
  authenticate,
  authorize(UserRole.EMPLOYER),
  requireVerified,
  async (req: AuthRequest, res, next) => {
    try {
      const employerId = req.user!.id;
      const { candidateId } = req.params;
      const { jobId, message } = req.body;

      const employer = await prisma.user.findFirst({
        where: { id: employerId, role: 'EMPLOYER' },
        include: { company: true }
      });

      if (!employer?.company) {
        throw new AppError('Kompaniya topilmadi', 404);
      }

      const existingRequest = await prisma.contactRequest.findFirst({
        where: {
          employerId,
          candidateId,
          jobId: jobId || null,
          status: 'PENDING'
        }
      });

      if (existingRequest) {
        throw new AppError('Siz allaqachon bu nomzodga so\'rov yuborgansiz', 400);
      }

      const contactRequest = await prisma.contactRequest.create({
        data: {
          employerId,
          candidateId,
          jobId: jobId || null,
          message
        }
      });

      const io = req.app.get('io');
      
      await prisma.notification.create({
        data: {
          userId: candidateId,
          title: 'Yangi bog\'lanish so\'rovi',
          message: `${employer.company.name} siz bilan bog\'lanmoqchi`,
          type: 'info'
        }
      });

      if (io) {
        io.to(candidateId).emit('new_notification', {
          title: 'Yangi bog\'lanish so\'rovi',
          message: `${employer.company.name} siz bilan bog\'lanmoqchi`,
          type: 'info'
        });
      }

      res.json(successResponse({
        request: contactRequest,
        message: 'So\'rov muvaffaqiyatli yuborildi'
      }));
    } catch (error) {
      next(error);
    }
  }
);

/**
 * ACCEPT CONTACT REQUEST - Candidate accepts employer's request
 */
router.post(
  '/accept/:requestId',
  authenticate,
  authorize(UserRole.CANDIDATE),
  async (req: AuthRequest, res, next) => {
    try {
      const candidateId = req.user!.id;
      const { requestId } = req.params;

      const contactRequest = await prisma.contactRequest.findUnique({
        where: { id: requestId },
      });

      if (!contactRequest || contactRequest.candidateId !== candidateId) {
        throw new AppError('So\'rov topilmadi', 404);
      }

      if (contactRequest.status !== 'PENDING') {
        throw new AppError('Bu so\'rov allaqachon ko\'rib chiqilgan', 400);
      }

      const employer = await prisma.user.findUnique({
        where: { id: contactRequest.employerId },
        include: { company: true }
      });

      const updatedRequest = await prisma.contactRequest.update({
        where: { id: requestId },
        data: { status: 'ACCEPTED' }
      });

      if (employer?.company) {
        await prisma.notification.create({
          data: {
            userId: contactRequest.employerId,
            title: 'So\'rov qabul qilindi',
            message: `Nomzod ${employer.company.name} kompaniyasi bilan bog\'lanishga rozi bo'ldi`,
            type: 'success'
          }
        });
      }

      res.json(successResponse({
        request: updatedRequest,
        message: 'So\'rov qabul qilindi. Endi kontaktlaringiz almashish mumkin.'
      }));

      await createAuditLogFromRequest(
        req,
        AuditActions.CONTACT_REQUEST_ACCEPT,
        'CONTACT_REQUEST',
        requestId,
        { employerId: contactRequest.employerId }
      );
    } catch (error) {
      next(error);
    }
  }
);

/**
 * REJECT CONTACT REQUEST - Candidate rejects employer's request
 */
router.post(
  '/reject/:requestId',
  authenticate,
  authorize(UserRole.CANDIDATE),
  async (req: AuthRequest, res, next) => {
    try {
      const candidateId = req.user!.id;
      const { requestId } = req.params;

      const contactRequest = await prisma.contactRequest.findUnique({
        where: { id: requestId },
      });

      if (!contactRequest || contactRequest.candidateId !== candidateId) {
        throw new AppError('So\'rov topilmadi', 404);
      }

      if (contactRequest.status !== 'PENDING') {
        throw new AppError('Bu so\'rov allaqachon ko\'rib chiqilgan', 400);
      }

      const employer = await prisma.user.findUnique({
        where: { id: contactRequest.employerId },
        include: { company: true }
      });

      const updatedRequest = await prisma.contactRequest.update({
        where: { id: requestId },
        data: { status: 'REJECTED' }
      });

      if (employer?.company) {
        await prisma.notification.create({
          data: {
            userId: contactRequest.employerId,
            title: 'So\'rov rad etildi',
            message: `Nomzod ${employer.company.name} kompaniyasining so\'rovini rad etdi`,
            type: 'warning'
          }
        });
      }

      res.json(successResponse({
        request: updatedRequest,
        message: 'So\'rov rad etildi'
      }));
    } catch (error) {
      next(error);
    }
  }
);

/**
 * CHECK CONTACT REQUEST STATUS - Check if employer has requested contact
 */
router.get(
  '/request-status/:candidateId',
  authenticate,
  authorize(UserRole.EMPLOYER),
  async (req: AuthRequest, res, next) => {
    try {
      const employerId = req.user!.id;
      const { candidateId } = req.params;

      const contactRequest = await prisma.contactRequest.findFirst({
        where: {
          employerId,
          candidateId,
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json(successResponse({
        hasRequest: !!contactRequest,
        status: contactRequest?.status || null,
        request: contactRequest
      }));
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET NOTIFICATIONS - Get user's notifications
 */
router.get(
  '/notifications',
  authenticate,
  async (req: AuthRequest, res, next) => {
    try {
      const userId = req.user!.id;
      const { page = '1', limit = '20' } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const [notifications, total, unreadCount] = await Promise.all([
        prisma.notification.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limitNum
        }),
        prisma.notification.count({ where: { userId } }),
        prisma.notification.count({ where: { userId, isRead: false } })
      ]);

      res.json(successResponse({
        notifications,
        unreadCount,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum)
        }
      }));
    } catch (error) {
      next(error);
    }
  }
);

/**
 * MARK NOTIFICATION AS READ
 */
router.patch(
  '/notifications/:id/read',
  authenticate,
  async (req: AuthRequest, res, next) => {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const notification = await prisma.notification.findFirst({
        where: { id, userId }
      });

      if (!notification) {
        throw new AppError('Bildirishnoma topilmadi', 404);
      }

      const updated = await prisma.notification.update({
        where: { id },
        data: { 
          isRead: true,
          readAt: new Date()
        }
      });

      res.json(successResponse(updated));
    } catch (error) {
      next(error);
    }
  }
);

/**
 * MARK ALL NOTIFICATIONS AS READ
 */
router.patch(
  '/notifications/read-all',
  authenticate,
  async (req: AuthRequest, res, next) => {
    try {
      const userId = req.user!.id;

      await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { 
          isRead: true,
          readAt: new Date()
        }
      });

      res.json(successResponse({ message: 'Barcha bildirishnomalar o\'qilgan' }));
    } catch (error) {
      next(error);
    }
  }
);

export default router;
