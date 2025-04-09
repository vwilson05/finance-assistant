import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { verifyToken, TokenPayload } from '../utils/jwt';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';

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
    if (req.user?.id !== userId) {
      return next(new AppError(403, 'Unauthorized access'));
    }
    next();
  };
}; 