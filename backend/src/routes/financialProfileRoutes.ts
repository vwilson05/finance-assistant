import { Router } from 'express';
import { FinancialProfileController } from '../controllers/financialProfileController';
import { authenticate, authorizeUser } from '../middleware/auth';
import { validateFinancialProfile } from '../middleware/validation';

const router = Router();
const controller = new FinancialProfileController();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get user's financial profile
router.get('/:userId', authorizeUser(':userId'), controller.getFinancialProfile);

// Create financial profile
router.post('/:userId', [authorizeUser(':userId'), validateFinancialProfile], controller.createFinancialProfile);

// Update financial profile
router.put('/:userId', [authorizeUser(':userId'), validateFinancialProfile], controller.updateFinancialProfile);

// Update financial goals
router.put('/:userId/goals', [authorizeUser(':userId'), validateFinancialProfile], controller.updateFinancialGoals);

// Update budget
router.put('/:userId/budget', [authorizeUser(':userId'), validateFinancialProfile], controller.updateFinancialBudget);

export const financialProfileRoutes = router; 