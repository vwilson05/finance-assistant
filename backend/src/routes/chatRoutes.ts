import { Router } from 'express';
import { ChatController } from '../controllers/chatController';
import { validateMessage } from '../middleware/validation';
import { authenticate, authorizeUser } from '../middleware/auth';

const router = Router();
const chatController = new ChatController();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get chat history for a user
router.get('/history/:userId', authorizeUser(':userId'), chatController.getChatHistory.bind(chatController));

// Get specific conversation thread
router.get('/thread/:threadId', chatController.getThread.bind(chatController));

// Send message to AI assistant
router.post('/message', validateMessage, chatController.sendMessage.bind(chatController));

// Get AI-generated financial advice
router.post('/advice/:userId', authorizeUser(':userId'), chatController.getFinancialAdvice.bind(chatController));

// Clear chat history
router.delete('/history/:userId', authorizeUser(':userId'), chatController.clearHistory.bind(chatController));

export const chatRoutes = router; 