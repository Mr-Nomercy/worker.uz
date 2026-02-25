import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';
import { successResponse, AppError } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth.middleware';

const JWT_SECRET = process.env.JWT_SECRET || 'worker-secret-key-change-in-production';

export const authController = {
  /**
   * POST /api/auth/login
   * Real authentication with database lookup
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new AppError('Email and password are required', 400);
      }

      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          profile: true,
          company: {
            include: {
              jobs: {
                select: { id: true },
                take: 1,
              },
            },
          },
        },
      });

      if (!user) {
        throw new AppError('Invalid email or password', 401);
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        throw new AppError('Invalid email or password', 401);
      }

      // Log the login action
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'LOGIN',
          entityType: 'USER',
          entityId: user.id,
          details: { 
            method: 'email_password', 
            verified: user.isVerified,
            role: user.role 
          },
          ipAddress: req.ip || 'unknown',
          userAgent: req.headers['user-agent'],
        },
      });

      const { passwordHash, ...userWithoutPassword } = user;

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json(successResponse({
        user: userWithoutPassword,
        token,
      }, 'Login successful'));
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/auth/me
   * Get current authenticated user
   */
  async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
          company: {
            include: {
              jobs: {
                orderBy: { createdAt: 'desc' },
                take: 5,
              },
            },
          },
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
      if (req.user?.id) {
        await prisma.auditLog.create({
          data: {
            userId: req.user.id,
            action: 'LOGOUT',
            entityType: 'USER',
            entityId: req.user.id,
            ipAddress: req.ip || 'unknown',
          },
        });
      }

      res.json(successResponse(null, 'Logout successful'));
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/auth/register
   * Register new user (candidate)
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, pinfl, passportSeries, fullName, birthDate } = req.body;

      // Check if user exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new AppError('Email already registered', 400);
      }

      // Check PINFL uniqueness
      const existingPinfl = await prisma.user.findUnique({ where: { pinfl } });
      if (existingPinfl) {
        throw new AppError('This PINFL is already registered', 400);
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          pinfl,
          passportSeries,
          role: 'CANDIDATE',
          isVerified: true, // In production, verify via OneID API
          profile: {
            create: {
              fullName,
              birthDate: new Date(birthDate),
              gender: 'MALE', // Get from request
              address: '',
              educationHistory: [],
              workHistory: [],
            },
          },
        },
        include: { profile: true },
      });

      const { passwordHash: _, ...userWithoutPassword } = user;

      res.status(201).json(successResponse(userWithoutPassword, 'Registration successful'));
    } catch (error) {
      next(error);
    }
  },
};

export default authController;
