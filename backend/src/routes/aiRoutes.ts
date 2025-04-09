import { Router } from 'express';
import { AIController } from '../controllers/aiController';

const router = Router();
const aiController = AIController.getInstance();

// Initialize AI service
router.post('/initialize', (req, res) => aiController.initialize(req, res));

// Add financial context
router.post('/context', (req, res) => aiController.addContext(req, res));

// Get financial advice
router.post('/advice', (req, res) => aiController.getAdvice(req, res));

export default router; 