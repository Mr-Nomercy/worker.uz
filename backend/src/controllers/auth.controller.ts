import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { catchAsync } from '../utils/catchAsync';
import { successResponse } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth.middleware';

export const authController = {
  login: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });

    res.json(successResponse(result, 'Login successful'));
  }),

  register: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, pinfl, passportSeries, fullName, birthDate } = req.body;
    const user = await authService.register({
      email,
      password,
      pinfl,
      passportSeries,
      fullName,
      birthDate,
    });

    const { passwordHash, ...userWithoutPassword } = user;
    res.status(201).json(successResponse(userWithoutPassword, 'Registration successful'));
  }),

  me: catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const user = await authService.getCurrentUser(userId);

    const { passwordHash, ...userWithoutPassword } = user;
    res.json(successResponse(userWithoutPassword));
  }),

  logout: catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    await authService.logout(userId);

    res.json(successResponse(null, 'Logout successful'));
  }),
};

export default authController;
