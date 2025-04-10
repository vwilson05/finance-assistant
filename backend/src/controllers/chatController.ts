import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';
import { AppDataSource } from '../config/database';
import { ChatMessage, MessageRole } from '../models/ChatMessage';
import { User } from '../models/User';
import { aiService } from '../services/aiService';

export class ChatController {
  async getChatHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id: userId } });
      
      if (!user) {
        throw new AppError(404, 'User not found');
      }
      
      const messageRepository = AppDataSource.getRepository(ChatMessage);
      const messages = await messageRepository.find({
        where: { user: { id: userId } },
        order: { createdAt: 'ASC' }
      });
      
      res.status(200).json({ messages });
    } catch (error) {
      next(error);
    }
  }

  async getThread(req: Request, res: Response, next: NextFunction) {
    try {
      const threadId = req.params.threadId;
      const messageRepository = AppDataSource.getRepository(ChatMessage);
      const messages = await messageRepository.find({
        where: { id: threadId },
        order: { createdAt: 'ASC' }
      });
      
      res.status(200).json({ messages });
    } catch (error) {
      next(error);
    }
  }

  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { content, role } = req.body;
      const userId = req.user?.id;
      
      if (!userId) {
        throw new AppError(401, 'User not authenticated');
      }
      
      // Create user message
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ 
        where: { id: userId },
        relations: ['financialProfile']
      });
      
      if (!user) {
        throw new AppError(404, 'User not found');
      }
      
      const messageRepository = AppDataSource.getRepository(ChatMessage);
      
      // Detect user intent and emotional state
      const userIntent = await this.detectUserIntent(content);
      const emotionalState = await this.detectEmotionalState(content);
      
      // Save user message with enhanced context
      const userMessage = messageRepository.create({
        user,
        content,
        role: role || MessageRole.USER,
        context: {
          userIntent,
          emotionalState,
          financialMetrics: user.financialProfile ? [
            { metric: 'riskTolerance', value: user.financialProfile.riskTolerance },
            { metric: 'investmentHorizon', value: user.financialProfile.investmentHorizon },
            { metric: 'currentSavings', value: user.financialProfile.currentSavings }
          ] : undefined
        }
      });
      
      await messageRepository.save(userMessage);
      
      // Add user's message to AI context
      await aiService.addFinancialContext(content, {
        type: 'user_message',
        userId: user.id,
        timestamp: new Date().toISOString(),
        importance: 'medium',
        userIntent,
        emotionalState
      });
      
      // Add user's financial context to AI service if available
      if (user.financialProfile) {
        await aiService.addFinancialContext(
          JSON.stringify(user.financialProfile),
          {
            type: 'financial_profile',
            userId: user.id,
            timestamp: new Date().toISOString(),
            importance: 'high',
            userName: user.name || 'there'
          }
        );
      }
      
      // Generate AI response with enhanced context
      const aiResponse = await aiService.generateResponse(content, user);
      
      // Add AI response to context
      await aiService.addFinancialContext(aiResponse, {
        type: 'ai_response',
        userId: user.id,
        timestamp: new Date().toISOString(),
        importance: 'medium'
      });
      
      // Save AI response with metadata
      const assistantMessage = messageRepository.create({
        user,
        content: aiResponse,
        role: MessageRole.ASSISTANT,
        metadata: {
          tokens: 0, // TODO: Implement token counting
          processingTime: 0, // TODO: Implement processing time tracking
          model: 'ollama-tinyllama'
        }
      });
      
      await messageRepository.save(assistantMessage);
      
      res.status(200).json({ 
        message: assistantMessage,
        userMessage
      });
    } catch (error) {
      next(error);
    }
  }

  private async detectUserIntent(content: string): Promise<string> {
    // Simple intent detection based on keywords
    const contentLower = content.toLowerCase();
    if (contentLower.includes('invest') || contentLower.includes('stock') || contentLower.includes('market')) {
      return 'investment_advice';
    } else if (contentLower.includes('save') || contentLower.includes('budget') || contentLower.includes('spend')) {
      return 'savings_advice';
    } else if (contentLower.includes('retire') || contentLower.includes('future') || contentLower.includes('plan')) {
      return 'retirement_planning';
    } else if (contentLower.includes('debt') || contentLower.includes('loan') || contentLower.includes('credit')) {
      return 'debt_management';
    } else if (contentLower.includes('tax') || contentLower.includes('deduct') || contentLower.includes('refund')) {
      return 'tax_planning';
    } else if (contentLower.includes('insurance') || contentLower.includes('coverage') || contentLower.includes('policy')) {
      return 'insurance_advice';
    } else if (contentLower.includes('goal') || contentLower.includes('target') || contentLower.includes('aim')) {
      return 'goal_setting';
    } else {
      return 'general_advice';
    }
  }
  
  private async detectEmotionalState(content: string): Promise<string> {
    // Simple emotional state detection based on keywords
    const contentLower = content.toLowerCase();
    
    // Positive emotions
    if (contentLower.includes('happy') || contentLower.includes('excited') || contentLower.includes('great') || 
        contentLower.includes('thank') || contentLower.includes('appreciate')) {
      return 'positive';
    }
    
    // Negative emotions
    if (contentLower.includes('worried') || contentLower.includes('concerned') || contentLower.includes('anxious') || 
        contentLower.includes('stress') || contentLower.includes('frustrated') || contentLower.includes('angry')) {
      return 'negative';
    }
    
    // Neutral emotions
    return 'neutral';
  }

  async getFinancialAdvice(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const { query } = req.body;
      
      if (!query) {
        throw new AppError(400, 'Query is required');
      }
      
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ 
        where: { id: userId },
        relations: ['financialProfile']
      });
      
      if (!user) {
        throw new AppError(404, 'User not found');
      }
      
      const advice = await aiService.generateFinancialAdvice(query, user);
      
      res.status(200).json({ advice });
    } catch (error) {
      next(error);
    }
  }

  async clearHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      
      const messageRepository = AppDataSource.getRepository(ChatMessage);
      await messageRepository.delete({ user: { id: userId } });
      
      res.status(200).json({ message: 'Chat history cleared successfully' });
    } catch (error) {
      next(error);
    }
  }
} 