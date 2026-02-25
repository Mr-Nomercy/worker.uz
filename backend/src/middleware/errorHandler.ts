import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/apiResponse';

interface PrismaError extends Error {
  code?: string;
  meta?: any;
}

export const errorHandler = (
  err: PrismaError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  // Handle Prisma-specific errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as PrismaError;

    switch (prismaError.code) {
      case 'P2002':
        // Unique constraint violation
        const field = prismaError.meta?.target?.join(', ') || 'field';
        return res.status(400).json({
          success: false,
          error: `A record with this ${field} already exists.`,
          code: 'DUPLICATE_ENTRY',
        });

      case 'P2003':
        // Foreign key constraint failed
        return res.status(400).json({
          success: false,
          error: 'Referenced record does not exist.',
          code: 'FOREIGN_KEY_ERROR',
        });

      case 'P2005':
        // Invalid value for field
        return res.status(400).json({
          success: false,
          error: `Invalid value for field: ${prismaError.meta?.field_name}`,
          code: 'INVALID_VALUE',
        });

      case 'P2006':
        // Required field is missing
        return res.status(400).json({
          success: false,
          error: `Required field is missing: ${prismaError.meta?.field_name}`,
          code: 'MISSING_REQUIRED_FIELD',
        });

      case 'P2014':
        // Record does not satisfy constraint
        return res.status(400).json({
          success: false,
          error: 'Record does not satisfy the required constraints.',
          code: 'CONSTRAINT_VIOLATION',
        });

      case 'P2025':
        // Record not found (during update/delete)
        return res.status(404).json({
          success: false,
          error: 'The requested record was not found.',
          code: 'RECORD_NOT_FOUND',
        });

      default:
        return res.status(400).json({
          success: false,
          error: 'Database operation failed. Please try again.',
          code: 'DATABASE_ERROR',
        });
    }
  }

  // Handle Prisma validation errors
  if (err.name === 'PrismaClientValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid data provided. Please check your input.',
      code: 'VALIDATION_ERROR',
    });
  }

  // Handle custom AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      code: err.statusCode.toString(),
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token. Please log in again.',
      code: 'INVALID_TOKEN',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expired. Please log in again.',
      code: 'TOKEN_EXPIRED',
    });
  }

  // Handle bcrypt errors
  if (err.message?.includes('bcrypt')) {
    return res.status(500).json({
      success: false,
      error: 'Authentication error. Please try again.',
      code: 'AUTH_ERROR',
    });
  }

  // Default error
  const statusCode = (err as any).statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'An unexpected error occurred. Please try again later.' 
    : err.message;

  res.status(statusCode).json({
    success: false,
    error: message,
    code: statusCode.toString(),
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`,
    code: 'NOT_FOUND',
  });
};

export class AsyncHandler {
  static fn(fn: Function) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}
