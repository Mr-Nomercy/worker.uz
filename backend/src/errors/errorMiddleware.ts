import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { ApiError } from './ApiError';

interface ErrorResponse {
  success: boolean;
  message: string;
  errorCode: string;
  details?: Record<string, unknown>;
  stack?: string;
}

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): Response<ErrorResponse> => {
  console.error(`[ERROR] ${err.name}: ${err.message}`);

  if (err instanceof ZodError) {
    const details = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errorCode: 'VALIDATION_ERROR',
      details: { errors: details },
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': {
        const target = err.meta?.target as string[] | undefined;
        const field = target?.join(', ') || 'field';
        return res.status(409).json({
          success: false,
          message: `Ushbu ${field} allaqachon mavjud.`,
          errorCode: 'DUPLICATE_ENTRY',
        });
      }
      case 'P2003':
        return res.status(400).json({
          success: false,
          message: 'Bog\'langan ma\'lumot topilmadi.',
          errorCode: 'FOREIGN_KEY_ERROR',
        });
      case 'P2025':
        return res.status(404).json({
          success: false,
          message: 'Ma\'lumot topilmadi.',
          errorCode: 'RECORD_NOT_FOUND',
        });
      default:
        return res.status(400).json({
          success: false,
          message: 'Baza xatosi yuz berdi.',
          errorCode: 'DATABASE_ERROR',
        });
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      success: false,
      message: 'Noto\'g\'ri ma\'lumot kiritildi.',
      errorCode: 'VALIDATION_ERROR',
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errorCode: err.errorCode,
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Noto\'g\'ri token.',
      errorCode: 'INVALID_TOKEN',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Sessiya muddati tugagan.',
      errorCode: 'TOKEN_EXPIRED',
    });
  }

  if (err.message?.includes('Multer') || err.name === 'MulterError') {
    const statusCode = err.message.includes('File too large') ? 413 : 400;
    return res.status(statusCode).json({
      success: false,
      message: err.message,
      errorCode: 'FILE_UPLOAD_ERROR',
    });
  }

  const statusCode = 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Kutilmagan xato yuz berdi.'
    : err.message;

  return res.status(statusCode).json({
    success: false,
    message,
    errorCode: 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

export const notFoundHandler = (req: Request, res: Response): Response<ErrorResponse> => {
  return res.status(404).json({
    success: false,
    message: `Yo'l topilmadi: ${req.method} ${req.originalUrl}`,
    errorCode: 'NOT_FOUND',
  });
};
