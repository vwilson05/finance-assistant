import { Request, Response } from 'express';
import { MessageRole } from '../models/ChatMessage';
import { AuthService } from '../services/authService';
import { FinancialProfileService } from '../services/financialProfileService';
import { aiService } from '../services/aiService';
import { ChatMessageRepository } from '../repositories/chatMessageRepository';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { AIResponse } from '../types/ai';

export class ChatController {
  constructor(
    private authService: AuthService,
    private financialProfileService: FinancialProfileService,
    private chatMessageRepository: ChatMessageRepository
  ) {}

  private shouldUseFunctionCall(content: string, userIntent: string): boolean {
    const functionCallTriggers = [
      'update_profile',
      'calculate_metrics',
      'generate_report'
    ];
    return functionCallTriggers.includes(userIntent);
  }

  private determineFunctionCall(content: string, userIntent: string) {
    return {
      name: userIntent,
      arguments: { content }
    };
  }

  async getChatHistory(req: Request, res: Response) {
    try {
      const user = await this.authService.authenticateUser(req);
      if (!user) {
        throw new AppError(401, 'Unauthorized');
      }

      const messages = await this.chatMessageRepository.getUserMessages(user.id);
      return res.json({
        success: true,
        messages
      });
    } catch (error) {
      logger.error('Error in getChatHistory:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ 
          success: false,
          error: error.message 
        });
      }
      
      return res.status(500).json({ 
        success: false,
        error: 'Failed to retrieve chat history' 
      });
    }
  }

  async getThread(req: Request, res: Response) {
    try {
      const { threadId } = req.params;
      const user = await this.authService.authenticateUser(req);
      
      if (!user) {
        throw new AppError(401, 'Unauthorized');
      }

      const messages = await this.chatMessageRepository.getThreadMessages(threadId, user.id);
      return res.json({
        success: true,
        messages
      });
    } catch (error) {
      logger.error('Error in getThread:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ 
          success: false,
          error: error.message 
        });
      }
      
      return res.status(500).json({ 
        success: false,
        error: 'Failed to retrieve thread' 
      });
    }
  }

  async sendMessage(req: Request, res: Response) {
    try {
      const { content, role = MessageRole.USER, enableFunctionCalling = false } = req.body;
      const user = await this.authService.authenticateUser(req);

      if (!user) {
        throw new AppError(401, 'Unauthorized');
      }

      const financialProfile = await this.financialProfileService.getFinancialProfile(user.id);
      const userIntent = await this.aiService.detectUserIntent(content);
      const emotionalState = await this.aiService.detectEmotionalState(content);

      // Save user message with enhanced context
      const userMessage = await this.chatMessageRepository.save({
        user,
        content,
        role,
        context: {
          userIntent,
          emotionalState,
          financialMetrics: financialProfile ? [
            { metric: 'netWorth', value: financialProfile.netWorth },
            { metric: 'monthlyIncome', value: financialProfile.monthlyIncome },
            { metric: 'monthlyExpenses', value: financialProfile.monthlyExpenses }
          ] : undefined
        }
      });

      // Add user message and financial context to AI service
      await this.aiService.addMessage({
        role: MessageRole.USER,
        content,
        context: {
          financialProfile: financialProfile || undefined,
          userIntent,
          emotionalState
        }
      });

      // Generate AI response
      let assistantMessage: AIResponse;
      let functionCall;

      if (enableFunctionCalling && this.shouldUseFunctionCall(content, userIntent)) {
        functionCall = this.determineFunctionCall(content, userIntent);
        const response = await this.aiService.generateResponseWithFunctionCall(functionCall);
        assistantMessage = response;
        functionCall.result = response.functionResult;
      } else {
        const response = await this.aiService.generateResponse(content, user);
        assistantMessage = typeof response === 'string' ? { content: response } : response;
      }

      // Save AI response with metadata
      const savedAssistantMessage = await this.chatMessageRepository.save({
        user,
        content: assistantMessage.content,
        role: MessageRole.ASSISTANT,
        context: {
          userIntent,
          emotionalState
        },
        metadata: {
          tokens: assistantMessage.usage?.totalTokens || 0,
          processingTime: assistantMessage.usage?.processingTime || 0,
          model: assistantMessage.model || 'gpt-4'
        },
        functionCall
      });

      return res.json({
        success: true,
        assistantMessage: savedAssistantMessage,
        userMessage
      });
    } catch (error) {
      logger.error('Error in sendMessage:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ 
          success: false,
          error: error.message 
        });
      }
      
      return res.status(500).json({ 
        success: false,
        error: 'Failed to process message' 
      });
    }
  }

  async getFinancialAdvice(req: Request, res: Response) {
    try {
      const user = await this.authService.authenticateUser(req);
      
      if (!user) {
        throw new AppError(401, 'Unauthorized');
      }

      const financialProfile = await this.financialProfileService.getFinancialProfile(user.id);
      if (!financialProfile) {
        throw new AppError(404, 'Financial profile not found');
      }

      const advice = await this.aiService.generateFinancialAdvice(financialProfile);
      return res.json({
        success: true,
        advice
      });
    } catch (error) {
      logger.error('Error in getFinancialAdvice:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ 
          success: false,
          error: error.message 
        });
      }
      
      return res.status(500).json({ 
        success: false,
        error: 'Failed to generate financial advice' 
      });
    }
  }

  async clearHistory(req: Request, res: Response) {
    try {
      const user = await this.authService.authenticateUser(req);
      
      if (!user) {
        throw new AppError(401, 'Unauthorized');
      }

      await this.chatMessageRepository.clearUserHistory(user.id);
      return res.json({
        success: true,
        message: 'Chat history cleared successfully'
      });
    } catch (error) {
      logger.error('Error in clearHistory:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ 
          success: false,
          error: error.message 
        });
      }
      
      return res.status(500).json({ 
        success: false,
        error: 'Failed to clear chat history' 
      });
    }
  }
} 