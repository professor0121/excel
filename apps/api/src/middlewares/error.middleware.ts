import type { Request, Response, NextFunction } from 'express';
import { AppError, NotFoundError } from '../utils/errors.js';
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error({ err }, `[AppError ${err.statusCode}] ${err.message}`);
    } else {
      logger.warn({ err }, `[ClientError ${err.statusCode}] ${err.message}`);
    }

    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        ...(env.NODE_ENV === 'development' ? { stack: err.stack } : {})
      }
    });
    return;
  }

  // Unhandled internal server errors
  logger.error({ err }, `[UnhandledError] ${err.message}`);

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected internal server error occurred',
      ...(env.NODE_ENV === 'development'
        ? { message: err.message, stack: err.stack }
        : {})
    }
  });
}
