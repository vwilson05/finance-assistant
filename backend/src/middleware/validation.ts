import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { IncomeFrequency, RiskTolerance } from '../models/FinancialProfile';
import { StrategyType, StrategyStatus } from '../models/Strategy';
import { MessageRole } from '../models/ChatMessage';
import { z } from 'zod';

// User validation schema
const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

// Financial profile validation schema
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

// Strategy validation schema
const strategySchema = z.object({
  type: z.enum(Object.values(StrategyType) as [string, ...string[]]),
  name: z.string(),
  description: z.string(),
  recommendations: z.array(
    z.object({
      action: z.string(),
      priority: z.number().min(1).max(5),
      timeframe: z.string(),
      expectedImpact: z.string(),
    })
  ),
  milestones: z.array(
    z.object({
      description: z.string(),
      targetDate: z.string().datetime(),
      completed: z.boolean(),
    })
  ),
  targetAmount: z.number().positive().optional(),
  targetDate: z.string().datetime().optional(),
  status: z.enum(Object.values(StrategyStatus) as [string, ...string[]]),
  progress: z.object({
    currentAmount: z.number().min(0),
    lastUpdated: z.string().datetime(),
    notes: z.string().optional(),
  }).optional(),
});

// Message validation schema
const messageSchema = z.object({
  content: z.string(),
  role: z.enum(Object.values(MessageRole) as [string, ...string[]]),
  context: z.object({
    relatedStrategy: z.string().uuid().optional(),
    financialMetrics: z.array(
      z.object({
        metric: z.string(),
        value: z.number(),
      })
    ).optional(),
    userIntent: z.string().optional(),
  }).optional(),
});

// Generic validation middleware
const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors
          .map(err => `${err.path.join('.')}: ${err.message}`)
          .join(', ');
        return next(new AppError(400, errorMessage));
      }
      next(error);
    }
  };
};

export const validateUser = validate(userSchema);
export const validateFinancialProfile = validate(financialProfileSchema);
export const validateStrategy = validate(strategySchema);
export const validateMessage = validate(messageSchema);
export const validateRequest = validate; 