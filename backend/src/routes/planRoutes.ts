import { Router } from 'express';
import { PlanController } from '../controllers/planController';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { z } from 'zod';

const router = Router();
const planController = new PlanController();

// Validation schemas
const eventSchema = z.object({
  eventType: z.string(),
  eventData: z.record(z.any()),
});

const planSchema = z.object({
  planData: z.record(z.any()),
});

const reflectionSchema = z.object({
  reflectionData: z.record(z.any()),
});

// Routes
router.get('/profile', authenticate, planController.getUserProfile);
router.get('/goals', authenticate, planController.getUserGoals);
router.post('/simulate', authenticate, validateRequest(eventSchema), planController.simulateEvent);
router.post('/save', authenticate, validateRequest(planSchema), planController.savePlan);
router.post('/reflection', authenticate, validateRequest(reflectionSchema), planController.saveReflection);
router.get('/weekly-summary', authenticate, planController.getWeeklySummary);

export default router; 