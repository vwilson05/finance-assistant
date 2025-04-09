import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { FinancialProfile } from '../models/FinancialProfile';
import { User } from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export class FinancialProfileController {
  private profileRepository = AppDataSource.getRepository(FinancialProfile);
  private userRepository = AppDataSource.getRepository(User);

  public getFinancialProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;

      const profile = await this.profileRepository.findOne({
        where: { user: { id: userId } },
        relations: ['user'],
      });

      if (!profile) {
        throw new AppError(404, 'Financial profile not found');
      }

      res.json({
        status: 'success',
        data: {
          profile,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public createFinancialProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const profileData = req.body;

      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['financialProfile'],
      });

      if (!user) {
        throw new AppError(404, 'User not found');
      }

      if (user.financialProfile) {
        throw new AppError(400, 'User already has a financial profile');
      }

      const profile = this.profileRepository.create({
        ...profileData,
        user,
      });

      await this.profileRepository.save(profile);

      res.status(201).json({
        status: 'success',
        data: {
          profile,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public updateFinancialProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const profileData = req.body;

      const profile = await this.profileRepository.findOne({
        where: { user: { id: userId } },
        relations: ['user'],
      });

      if (!profile) {
        throw new AppError(404, 'Financial profile not found');
      }

      Object.assign(profile, profileData);
      await this.profileRepository.save(profile);

      res.json({
        status: 'success',
        data: {
          profile,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public updateFinancialGoals = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const { financialGoals } = req.body;

      const profile = await this.profileRepository.findOne({
        where: { user: { id: userId } },
        relations: ['user'],
      });

      if (!profile) {
        throw new AppError(404, 'Financial profile not found');
      }

      profile.financialGoals = financialGoals;
      await this.profileRepository.save(profile);

      res.json({
        status: 'success',
        data: {
          profile,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public updateFinancialBudget = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const { monthlyBudget } = req.body;

      const profile = await this.profileRepository.findOne({
        where: { user: { id: userId } },
        relations: ['user'],
      });

      if (!profile) {
        throw new AppError(404, 'Financial profile not found');
      }

      profile.monthlyBudget = monthlyBudget;
      await this.profileRepository.save(profile);

      res.json({
        status: 'success',
        data: {
          profile,
        },
      });
    } catch (error) {
      next(error);
    }
  }
} 