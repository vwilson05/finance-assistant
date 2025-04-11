import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { FinancialProfile } from '../models/FinancialProfile';
import { User } from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export class PlanController {
  private profileRepository = AppDataSource.getRepository(FinancialProfile);
  private userRepository = AppDataSource.getRepository(User);

  public getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(401, 'User not authenticated');
      }

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

  public getUserGoals = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(401, 'User not authenticated');
      }

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
          goals: profile.financialGoals || [],
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public simulateEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(401, 'User not authenticated');
      }

      const { eventType, eventData } = req.body;
      if (!eventType || !eventData) {
        throw new AppError(400, 'Event type and data are required');
      }

      // TODO: Implement event simulation logic
      const simulationResult = {
        eventType,
        impact: 'neutral',
        recommendations: [],
      };

      res.json({
        status: 'success',
        data: {
          simulation: simulationResult,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public savePlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(401, 'User not authenticated');
      }

      const { planData } = req.body;
      if (!planData) {
        throw new AppError(400, 'Plan data is required');
      }

      // TODO: Implement plan saving logic
      const savedPlan = {
        id: 'temp-id',
        ...planData,
        createdAt: new Date(),
      };

      res.status(201).json({
        status: 'success',
        data: {
          plan: savedPlan,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public saveReflection = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(401, 'User not authenticated');
      }

      const { reflectionData } = req.body;
      if (!reflectionData) {
        throw new AppError(400, 'Reflection data is required');
      }

      // TODO: Implement reflection saving logic
      const savedReflection = {
        id: 'temp-id',
        ...reflectionData,
        createdAt: new Date(),
      };

      res.status(201).json({
        status: 'success',
        data: {
          reflection: savedReflection,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public getWeeklySummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(401, 'User not authenticated');
      }

      // TODO: Implement weekly summary logic
      const weeklySummary = {
        period: '2024-W15',
        income: 0,
        expenses: 0,
        savings: 0,
        goals: [],
        insights: [],
      };

      res.json({
        status: 'success',
        data: {
          summary: weeklySummary,
        },
      });
    } catch (error) {
      next(error);
    }
  }
} 