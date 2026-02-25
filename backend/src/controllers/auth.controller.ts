import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';
import { successResponse, AppError } from '../utils/apiResponse';
import { UserRole } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

export const authController = {
  /**
   * POST /api/auth/login
   * Mock OneID authentication
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, pinfl } = req.body;

      // In production, this would validate against OneID API
      // For demo, we use email/password with optional PINFL verification
      
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          profile: true,
          company: true,
        },
      });

      if (!user) {
        throw new AppError('Invalid credentials', 401);
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        throw new AppError('Invalid credentials', 401);
      }

      // Log the login action
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'LOGIN',
          entityType: 'USER',
          entityId: user.id,
          details: { method: 'email_password', verified: user.isVerified },
          ipAddress: req.ip || 'unknown',
          userAgent: req.headers['user-agent'],
        },
      });

      // Return user info (excluding password)
      // In production, return JWT token instead
      const { passwordHash, ...userWithoutPassword } = user;

      res.json(successResponse({
        user: userWithoutPassword,
        token: `mock-jwt-token-${user.id}`, // Replace with real JWT in production
      }, 'Login successful'));
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/auth/me
   * Get current user profile
   */
  async me(req: AuthRequest, res: Response, next: NextFunction) {
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
        throw new AppError('User not found', 404);
      }

      const { passwordHash, ...userWithoutPassword } = user;

      res.json(successResponse(userWithoutPassword));
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/auth/logout
   */
  async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await prisma.auditLog.create({
        data: {
          userId: req.user!.id,
          action: 'LOGOUT',
          entityType: 'USER',
          entityId: req.user!.id,
          ipAddress: req.ip || 'unknown',
        },
      });

      res.json(successResponse(null, 'Logout successful'));
    } catch (error) {
      next(error);
    }
  },
};

export default authController;
