import { Router } from 'express';
import { StrategyController } from '../controllers/strategyController';
import { validateStrategy } from '../middleware/validation';
import { authenticate, authorizeUser } from '../middleware/auth';

const router = Router();
const strategyController = new StrategyController();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all strategies for a user
router.get('/user/:userId', authorizeUser(':userId'), strategyController.getUserStrategies);

// Get specific strategy
router.get('/:id', strategyController.getStrategy);

// Generate new strategy
router.post('/generate/:userId', strategyController.generateStrategy);

// Create strategy manually
router.post('/', validateStrategy, strategyController.createStrategy);

// Update strategy
router.put('/:id', validateStrategy, strategyController.updateStrategy);

// Update strategy status
router.patch('/:id/status', strategyController.updateStatus);

// Update strategy progress
router.patch('/:id/progress', strategyController.updateProgress);

// Delete strategy
router.delete('/:id', strategyController.deleteStrategy);

export const strategyRoutes = router; 