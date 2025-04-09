import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from './errorHandler';
import { IncomeFrequency, RiskTolerance } from '../models/FinancialProfile';
import { StrategyType, StrategyStatus } from '../models/Strategy';
import { MessageRole } from '../models/ChatMessage';
import { z } from 'zod';

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  dateOfBirth: Joi.date().iso().required(),
});

const financialProfileSchema = z.object({
  monthlyIncome: z.number().positive(),
  monthlyExpenses: z.number().nonnegative(),
  monthlyBudget: z.number().nonnegative(),
  savingsGoal: z.number().nonnegative(),
  riskTolerance: z.enum(['low', 'medium', 'high']),
  investmentPreferences: z.array(z.string()),
  financialGoals: z.array(z.object({
    title: z.string().min(1),
    targetAmount: z.number().positive(),
    deadline: z.string().datetime(),
    priority: z.enum(['low', 'medium', 'high']),
    progress: z.number().min(0).max(100).optional(),
  })),
  debtInformation: z.array(z.object({
    type: z.string(),
    amount: z.number().positive(),
    interestRate: z.number().nonnegative(),
    minimumPayment: z.number().nonnegative(),
  })).optional(),
});

const strategySchema = Joi.object({
  type: Joi.string().valid(...Object.values(StrategyType)).required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  recommendations: Joi.array().items(
    Joi.object({
      action: Joi.string().required(),
      priority: Joi.number().min(1).max(5).required(),
      timeframe: Joi.string().required(),
      expectedImpact: Joi.string().required(),
    })
  ),
  milestones: Joi.array().items(
    Joi.object({
      description: Joi.string().required(),
      targetDate: Joi.date().iso().required(),
      completed: Joi.boolean().required(),
    })
  ),
  targetAmount: Joi.number().positive().optional(),
  targetDate: Joi.date().iso().optional(),
  status: Joi.string().valid(...Object.values(StrategyStatus)).required(),
  progress: Joi.object({
    currentAmount: Joi.number().min(0).required(),
    lastUpdated: Joi.date().iso().required(),
    notes: Joi.string().optional(),
  }).optional(),
});

const messageSchema = Joi.object({
  content: Joi.string().required(),
  role: Joi.string().valid(...Object.values(MessageRole)).required(),
  context: Joi.object({
    relatedStrategy: Joi.string().uuid().optional(),
    financialMetrics: Joi.array().items(
      Joi.object({
        metric: Joi.string().required(),
        value: Joi.number().required(),
      })
    ).optional(),
    userIntent: Joi.string().optional(),
  }).optional(),
});

const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message)
        .join(', ');
      
      return next(new AppError(400, errorMessage));
    }
    
    next();
  };
};

export const validateUser = validate(userSchema);
export const validateFinancialProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = await financialProfileSchema.parseAsync(req.body);
    req.body = validatedData;
    next();
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      next(new AppError(400, 'Invalid financial profile data', error.errors));
    } else {
      next(new AppError(500, 'Internal server error during validation'));
    }
  }
};
export const validateStrategy = validate(strategySchema);
export const validateMessage = validate(messageSchema); 