export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errorCode: string;

  constructor(
    message: string,
    statusCode: number = 500,
    errorCode: string = 'INTERNAL_ERROR'
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errorCode = errorCode;

    Object.setPrototypeOf(this, ApiError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, errorCode: string = 'BAD_REQUEST'): ApiError {
    return new ApiError(message, 400, errorCode);
  }

  static unauthorized(message: string = 'Unauthorized', errorCode: string = 'UNAUTHORIZED'): ApiError {
    return new ApiError(message, 401, errorCode);
  }

  static forbidden(message: string = 'Forbidden', errorCode: string = 'FORBIDDEN'): ApiError {
    return new ApiError(message, 403, errorCode);
  }

  static notFound(message: string = 'Resource not found', errorCode: string = 'NOT_FOUND'): ApiError {
    return new ApiError(message, 404, errorCode);
  }

  static conflict(message: string, errorCode: string = 'CONFLICT'): ApiError {
    return new ApiError(message, 409, errorCode);
  }

  static tooManyRequests(message: string = 'Too many requests', errorCode: string = 'RATE_LIMITED'): ApiError {
    return new ApiError(message, 429, errorCode);
  }

  static internal(message: string = 'Internal server error', errorCode: string = 'INTERNAL_ERROR'): ApiError {
    return new ApiError(message, 500, errorCode);
  }
}
