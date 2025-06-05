// Base error class for application errors
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
    
    // Set the prototype explicitly
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// 400 Bad Request - Invalid input
export class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, 400);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

// 401 Unauthorized - Authentication required
export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

// 403 Forbidden - Insufficient permissions
export class ForbiddenError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

// 404 Not Found - Resource not found
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

// 409 Conflict - Resource conflict
export class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

// 422 Unprocessable Entity - Validation error
export class ValidationError extends AppError {
  constructor(message = 'Validation error') {
    super(message, 422);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

// 429 Too Many Requests - Rate limit exceeded
export class RateLimitError extends AppError {
  constructor(message = 'Rate limit exceeded') {
    super(message, 429);
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

// 500 Internal Server Error - Server error
export class InternalServerError extends AppError {
  constructor(message = 'Internal server error') {
    super(message, 500, false);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

// 503 Service Unavailable - Service unavailable
export class ServiceUnavailableError extends AppError {
  constructor(message = 'Service unavailable') {
    super(message, 503);
    Object.setPrototypeOf(this, ServiceUnavailableError.prototype);
  }
}

// Error handler middleware
export const errorHandler = (err: Error, req: any, res: any, next: any) => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      statusCode: err.statusCode,
    });
  }

  // Default to 500 internal server error for unhandled errors
  return res.status(500).json({
    error: 'Internal server error',
    statusCode: 500,
  });
};

