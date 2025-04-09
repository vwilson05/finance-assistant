import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { hashPassword, verifyPassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { logger } from '../utils/logger';

export class UserController {
  private userRepository = AppDataSource.getRepository(User);

  async register(req: Request, res: Response, next: NextFunction) {
    const { email, password, firstName, lastName, dateOfBirth } = req.body;

    if (!email || !password || !firstName || !lastName || !dateOfBirth) {
      throw new AppError(400, 'Email, password, first name, last name, and date of birth are required');
    }

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError(409, 'Email already registered');
    }

    const hashedPassword = await hashPassword(password);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      dateOfBirth: new Date(dateOfBirth),
    });

    await this.userRepository.save(user);
    logger.info(`User registered: ${email}`);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError(400, 'Email and password are required');
    }

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new AppError(401, 'Invalid email or password');
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid email or password');
    }

    const token = generateToken(user);
    logger.info(`User logged in: ${email}`);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(401, 'User not authenticated');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
      },
    });
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(401, 'User not authenticated');
    }

    const { firstName, lastName, email, dateOfBirth } = req.body;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    if (email && email !== user.email) {
      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        throw new AppError(409, 'Email already in use');
      }
      user.email = email;
    }

    if (firstName) {
      user.firstName = firstName;
    }

    if (lastName) {
      user.lastName = lastName;
    }

    if (dateOfBirth) {
      user.dateOfBirth = new Date(dateOfBirth);
    }

    await this.userRepository.save(user);
    logger.info(`User profile updated: ${user.email}`);

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
      },
    });
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(401, 'User not authenticated');
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      throw new AppError(400, 'Current password and new password are required');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const isPasswordValid = await verifyPassword(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new AppError(401, 'Current password is incorrect');
    }

    user.password = await hashPassword(newPassword);
    await this.userRepository.save(user);
    logger.info(`Password changed for user: ${user.email}`);

    res.status(200).json({
      message: 'Password changed successfully',
    });
  }

  async deleteAccount(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(401, 'User not authenticated');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    await this.userRepository.remove(user);
    logger.info(`User account deleted: ${user.email}`);

    res.status(200).json({
      message: 'Account deleted successfully',
    });
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    const users = await this.userRepository.find({
      select: ['id', 'email', 'firstName', 'lastName', 'dateOfBirth', 'createdAt', 'updatedAt'],
    });

    res.status(200).json({
      users,
    });
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'firstName', 'lastName', 'dateOfBirth', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    res.status(200).json({
      user,
    });
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    const { email, password, firstName, lastName, dateOfBirth } = req.body;

    if (!email || !password || !firstName || !lastName || !dateOfBirth) {
      throw new AppError(400, 'Email, password, first name, last name, and date of birth are required');
    }

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError(409, 'Email already registered');
    }

    const hashedPassword = await hashPassword(password);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      dateOfBirth: new Date(dateOfBirth),
    });

    await this.userRepository.save(user);
    logger.info(`User created by admin: ${email}`);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
      },
    });
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { firstName, lastName, email, dateOfBirth } = req.body;

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    if (email && email !== user.email) {
      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        throw new AppError(409, 'Email already in use');
      }
      user.email = email;
    }

    if (firstName) {
      user.firstName = firstName;
    }

    if (lastName) {
      user.lastName = lastName;
    }

    if (dateOfBirth) {
      user.dateOfBirth = new Date(dateOfBirth);
    }

    await this.userRepository.save(user);
    logger.info(`User updated by admin: ${user.email}`);

    res.status(200).json({
      message: 'User updated successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
      },
    });
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    await this.userRepository.remove(user);
    logger.info(`User deleted by admin: ${user.email}`);

    res.status(200).json({
      message: 'User deleted successfully',
    });
  }
} 