import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/apiResponse';

interface PrismaError extends Error {
  code?: string;
  meta?: { target?: string[]; field_name?: string };
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  error_code?: string;
  details?: Record<string, unknown>;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response<ApiErrorResponse> => {
  console.error('Error:', err.name, err.message);

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const details = err.issues.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      error_code: 'VALIDATION_ERROR',
      details: { errors: details }
    });
  }

  // Handle Prisma unique constraint violation (P2002)
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as PrismaError;
    
    switch (prismaError.code) {
      case 'P2002': {
        const field = prismaError.meta?.target?.join(', ') || 'field';
        return res.status(409).json({
          success: false,
          message: `Ushbu ${field} allaqachon mavjud.`,
          error_code: 'DUPLICATE_ENTRY',
        });
      }

      case 'P2003':
        return res.status(400).json({
          success: false,
          message: 'Bog\'langan ma\'lumot topilmadi.',
          error_code: 'FOREIGN_KEY_ERROR',
        });

      case 'P2025':
        return res.status(404).json({
          success: false,
          message: 'Ma\'lumot topilmadi.',
          error_code: 'RECORD_NOT_FOUND',
        });

      default:
        return res.status(400).json({
          success: false,
          message: 'Baza xatosi yuz berdi. Qayta urinib ko\'ring.',
          error_code: 'DATABASE_ERROR',
        });
    }
  }

  // Handle Prisma validation errors
  if (err.name === 'PrismaClientValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Noto\'g\'ri ma\'lumot kiritildi.',
      error_code: 'VALIDATION_ERROR',
    });
  }

  // Handle custom AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error_code: err.statusCode.toString(),
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError' || err.message?.includes('invalid token')) {
    return res.status(401).json({
      success: false,
      message: 'Noto\'g\'ri token. Iltimos, qayta kiring.',
      error_code: 'INVALID_TOKEN',
    });
  }

  if (err.name === 'TokenExpiredError' || err.message?.includes('token expired')) {
    return res.status(401).json({
      success: false,
      message: 'Sessiya muddati tugagan. Iltimos, qayta kiring.',
      error_code: 'TOKEN_EXPIRED',
    });
  }

  // Handle Multer file upload errors
  if (err.message?.includes('Multer') || err.name === 'MulterError') {
    const statusCode = err.message.includes('File too large') ? 413 : 400;
    return res.status(statusCode).json({
      success: false,
      message: err.message,
      error_code: 'FILE_UPLOAD_ERROR',
    });
  }

  // Handle bcrypt errors
  if (err.message?.includes('bcrypt') || err.message?.includes('data')) {
    return res.status(500).json({
      success: false,
      message: 'Avtorizatsiya xatosi yuz berdi.',
      error_code: 'AUTH_ERROR',
    });
  }

  // Default error - hide details in production
  const statusCode = (err as AppError).statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Kutilmagan xato yuz berdi. Keyinroq qayta urinib ko\'ring.' 
    : err.message;

  return res.status(statusCode).json({
    success: false,
    message,
    error_code: statusCode.toString(),
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

export const notFoundHandler = (req: Request, res: Response): Response<ApiErrorResponse> => {
  return res.status(404).json({
    success: false,
    message: `Yo'l topilmadi: ${req.method} ${req.originalUrl}`,
    error_code: 'NOT_FOUND',
  });
};

export class AsyncHandler {
  static fn(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}
