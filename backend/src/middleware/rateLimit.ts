import rateLimit from 'express-rate-limit';
import { AppError } from './errorHandler';

// Rate limit configuration from environment variables
const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10); // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10);

// General rate limiter for all routes
export const generalLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many requests from this IP, please try again later',
  handler: (req, res) => {
    throw new AppError(429, 'Too many requests from this IP, please try again later');
  },
});

// Stricter rate limiter for authentication routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many login attempts, please try again later',
  handler: (req, res) => {
    throw new AppError(429, 'Too many login attempts, please try again later');
  },
});

// Rate limiter for AI routes
export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 requests per hour
  message: 'AI request limit exceeded, please try again later',
  handler: (req, res) => {
    throw new AppError(429, 'AI request limit exceeded, please try again later');
  },
}); 