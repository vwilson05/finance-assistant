import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { verifyToken, TokenPayload } from '../utils/jwt';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { config } from '../config';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      token?: string;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // In development mode, create a mock user
    if (config.nodeEnv === 'development') {
      const userRepository = AppDataSource.getRepository(User);
      let user = await userRepository.findOne({
        where: { id: 'dev-user-1' },
        relations: ['financialProfile'],
      });

      // If dev user doesn't exist, create it
      if (!user) {
        user = userRepository.create({
          id: 'dev-user-1',
          email: 'dev@example.com',
          password: 'dev-password',
          firstName: 'Development',
          lastName: 'User',
          dateOfBirth: new Date('1990-01-01'),
        });
        await userRepository.save(user);
      }

      req.user = user;
      req.token = 'dev-token';
      return next();
    }

    // Production authentication logic
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError(401, 'No token provided');
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: payload.userId },
      relations: ['financialProfile'],
    });

    if (!user) {
      throw new AppError(401, 'User not found');
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorizeUser = (userId: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // In development mode, always allow access
    if (config.nodeEnv === 'development') {
      return next();
    }

    if (req.user?.id !== userId) {
      return next(new AppError(403, 'Unauthorized access'));
    }
    next();
  };
}; 