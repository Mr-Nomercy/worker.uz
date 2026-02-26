import { Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { successResponse, AppError } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth.middleware';
import { getFileUrl, deleteOldFile } from '../utils/upload';

export const profileController = {
  /**
   * POST /api/profile/upload-cv
   * Upload candidate's CV (PDF only, max 5MB)
   */
  async uploadCV(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      
      if (!req.file) {
        throw new AppError('Fayl yuklanmadi', 400);
      }

      // Get current profile to check for old CV
      const currentProfile = await prisma.profile.findUnique({
        where: { userId },
        select: { cvUrl: true }
      });

      // Delete old CV file if exists
      if (currentProfile?.cvUrl) {
        deleteOldFile(currentProfile.cvUrl);
      }

      const cvUrl = getFileUrl(req.file.filename, 'cv');

      // Update profile with CV URL
      const profile = await prisma.profile.update({
        where: { userId },
        data: {
          cvUrl,
        },
      });

      res.json(successResponse({
        cvUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
      }, 'CV muvaffaqiyatli yuklandi'));
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/profile/me
   * Get current user's profile
   */
  async getMyProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
          company: true,
        },
      });

      if (!user) {
        throw new AppError('Foydalanuvchi topilmadi', 404);
      }

      const { passwordHash, ...userWithoutPassword } = user;

      res.json(successResponse(userWithoutPassword));
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/profile/update
   * Update candidate's EDITABLE profile fields only
   * Government-verified data (fullName, pinfl, passport, education, workHistory) CANNOT be edited
   */
  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      
      // WHITELIST: Only these fields can be updated by users
      const ALLOWABLE_FIELDS = ['phoneNumber', 'softSkills', 'portfolioLinks', 'address'];
      
      // Filter out any attempt to modify government-verified fields
      const governmentVerifiedFields = ['fullName', 'pinfl', 'passportSeries', 'birthDate', 'gender', 'educationHistory', 'workHistory', 'isVerified', 'cvUrl'];
      
      // Check for prohibited fields in request
      const requestedFields = Object.keys(req.body);
      const prohibitedFields = requestedFields.filter(field => governmentVerifiedFields.includes(field));
      
      if (prohibitedFields.length > 0) {
        throw new AppError(`Quyidagi maydonlar o'zgartirilishi mumkin emas: ${prohibitedFields.join(', ')}`, 403);
      }
      
      // Extract only allowable fields
      const updateData: Record<string, any> = {};
      for (const field of ALLOWABLE_FIELDS) {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      }

      // Update only allowable fields
      const profile = await prisma.profile.update({
        where: { userId },
        data: updateData,
      });

      res.json(successResponse(profile, 'Profil yangilandi'));
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/profile/resync
   * Request re-sync from Government API (simulated)
   * Users cannot manually edit gov-verified data
   */
  async resyncGovData(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      
      // Get user PINFL to request from Gov API
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { pinfl: true, profile: true }
      });

      if (!user?.pinfl) {
        throw new AppError('PINFL topilmadi', 404);
      }

      // SIMULATION: In production, this would call the actual Government API
      // For now, we'll just return the current data with a success message
      const profile = await prisma.profile.findUnique({
        where: { userId }
      });

      res.json(successResponse({
        lastSynced: new Date().toISOString(),
        status: 'sync_complete',
        message: 'Ma\'lumotlar davlat bazasi bilan moslashtirildi',
        profile
      }, 'Ma\'lumotlar muvaffaqiyatli yangilandi'));
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/profile/upload-logo
   * Upload company's logo
   */
  async uploadLogo(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      
      if (!req.file) {
        throw new AppError('Fayl yuklanmadi', 400);
      }

      const logoUrl = getFileUrl(req.file.filename, 'logo');

      // Get user's company
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { company: true },
      });

      if (!user?.company) {
        throw new AppError('Kompaniya topilmadi', 404);
      }

      // Update company logo
      const company = await prisma.company.update({
        where: { id: user.company.id },
        data: { logoUrl },
      });

      res.json(successResponse({
        logoUrl,
        filename: req.file.filename,
      }, 'Logo muvaffaqiyatli yuklandi'));
    } catch (error) {
      next(error);
    }
  },
};

export default profileController;
