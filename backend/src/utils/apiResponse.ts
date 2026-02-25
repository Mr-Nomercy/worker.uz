export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const successResponse = <T>(data: T, message?: string) => ({
  success: true,
  data,
  message,
});

export const errorResponse = (message: string, statusCode: number = 400) => ({
  success: false,
  error: message,
  statusCode,
});

export const paginatedResponse = <T>(
  data: T,
  page: number,
  limit: number,
  total: number
) => ({
  success: true,
  data,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  },
});
