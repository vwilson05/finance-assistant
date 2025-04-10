import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../models/User';
import { AppError } from '../middleware/errorHandler';

// Ensure JWT_SECRET is provided
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export interface TokenPayload {
  userId: string;
  email: string;
}

export const generateToken = (user: User): string => {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
  };

  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
  };

  return jwt.sign(payload, Buffer.from(JWT_SECRET), options);
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, Buffer.from(JWT_SECRET)) as TokenPayload;
  } catch (error) {
    throw new AppError(401, 'Invalid or expired token');
  }
}; 