import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { aiLimiter } from '../middleware/rateLimit';

const router = Router();

// Protect all AI routes with authentication and rate limiting
router.use(authenticate);
router.use(aiLimiter);

// Import controllers after middleware setup to avoid circular dependencies
import { AIController } from '../controllers/aiController';
const aiController = AIController.getInstance();

// AI routes
router.post('/initialize', aiController.initialize.bind(aiController));
router.post('/context', aiController.addContext.bind(aiController));
router.post('/advice', aiController.getAdvice.bind(aiController));

export default router; 