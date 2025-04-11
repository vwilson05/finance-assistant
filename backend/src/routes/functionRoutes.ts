import express from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../models/User';
import { Strategy } from '../models/Strategy';
import { FinancialProfile } from '../models/FinancialProfile';
import { authenticate } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Endpoint to execute a function call
router.post('/function', async (req, res) => {
  try {
    const { name, arguments: args } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      throw new AppError(401, 'User not authenticated');
    }
    
    // Initialize repositories
    const userRepository = AppDataSource.getRepository(User);
    const strategyRepository = AppDataSource.getRepository(Strategy);
    const financialProfileRepository = AppDataSource.getRepository(FinancialProfile);
    
    // Execute the function based on the name
    let result;
    
    switch (name) {
      case 'getUserProfile':
        const user = await userRepository.findOne({
          where: { id: userId },
          relations: ['financialProfile']
        });
        
        if (!user) {
          throw new AppError(404, 'User not found');
        }
        
        result = {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          financialProfile: user.financialProfile
        };
        break;
        
      case 'getUserGoals':
        const strategies = await strategyRepository.find({
          where: { user: { id: userId } }
        });
        
        result = strategies.map(strategy => ({
          id: strategy.id,
          name: strategy.name,
          type: strategy.type,
          targetAmount: strategy.targetAmount,
          currentAmount: strategy.progress?.currentAmount || 0,
          status: strategy.status
        }));
        break;
        
      case 'simulateEvent':
        const eventData = JSON.parse(args);
        const profile = await financialProfileRepository.findOne({
          where: { user: { id: userId } }
        });
        
        if (!profile) {
          throw new AppError(404, 'Financial profile not found');
        }
        
        // Simulate the impact of the event on the financial profile
        result = {
          event: eventData.event,
          impact: {
            monthlyExpenses: eventData.event === 'baby' ? 1000 : 0,
            monthlyIncome: eventData.event === 'jobChange' ? 500 : 0,
            currentSavings: profile.currentSavings
          }
        };
        break;
        
      case 'savePlan':
        const planData = JSON.parse(args);
        const strategyToCreate = {
          ...planData,
          user: { id: userId }
        };
        
        const savedStrategy = await strategyRepository.save(strategyToCreate);
        
        result = { 
          success: true, 
          planId: savedStrategy.id, 
          ...planData 
        };
        break;
        
      case 'saveReflection':
        // This would typically save to a separate reflections table
        // For now, we'll just return a success response
        const reflectionData = JSON.parse(args);
        result = { 
          success: true, 
          reflectionId: 'ref-' + Date.now(), 
          ...reflectionData 
        };
        break;
        
      case 'getWeeklySummary':
        // This would typically aggregate data from various sources
        // For now, we'll return a simplified summary
        const userStrategies = await strategyRepository.find({
          where: { user: { id: userId } }
        });
        
        const userProfile = await financialProfileRepository.findOne({
          where: { user: { id: userId } }
        });
        
        result = {
          week: new Date().toISOString().split('T')[0],
          savings: userProfile?.currentSavings || 0,
          expenses: userProfile?.monthlyExpenses || 0,
          goalsProgress: userStrategies.map(strategy => ({
            goalId: strategy.id,
            progress: strategy.progress?.currentAmount || 0
          }))
        };
        break;
        
      default:
        throw new AppError(400, `Unknown function: ${name}`);
    }
    
    logger.info(`Function ${name} executed successfully for user ${userId}`);
    res.json({ result });
  } catch (error) {
    logger.error('Error executing function:', error);
    
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to execute function' });
    }
  }
});

export default router; 