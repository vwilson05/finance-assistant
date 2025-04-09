import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestInfo = {
    method: req.method,
    url: req.url,
    params: req.params,
    query: req.query,
    body: req.body,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  };

  if (err instanceof AppError) {
    logger.error({
      message: err.message,
      statusCode: err.statusCode,
      request: requestInfo,
      stack: err.stack,
    });
    
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Log unexpected errors with request context
  logger.error({
    message: 'Unexpected error',
    error: err.message,
    stack: err.stack,
    request: requestInfo,
  });
  
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
}; 