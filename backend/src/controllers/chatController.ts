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
      const user = await userRepository.findOne({ where: { id: userId } });
      
      if (!user) {
        throw new AppError(404, 'User not found');
      }
      
      const messageRepository = AppDataSource.getRepository(ChatMessage);
      
      // Save user message
      const userMessage = messageRepository.create({
        user,
        content,
        role: role || MessageRole.USER
      });
      
      await messageRepository.save(userMessage);
      
      // Generate AI response
      const aiResponse = await aiService.generateResponse(content, user);
      
      // Save AI response
      const assistantMessage = messageRepository.create({
        user,
        content: aiResponse,
        role: MessageRole.ASSISTANT
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