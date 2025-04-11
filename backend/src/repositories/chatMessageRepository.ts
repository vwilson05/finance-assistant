import { ChatMessage, MessageRole } from '../models/ChatMessage';
import { User } from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { AppDataSource } from '../data-source';
import { ILike } from 'typeorm';

export class ChatMessageRepository {
  private repository = AppDataSource.getRepository(ChatMessage);

  async save(messageData: {
    user: User;
    content: string;
    role: MessageRole;
    context?: ChatMessage['context'];
    metadata?: ChatMessage['metadata'];
    functionCall?: ChatMessage['functionCall'];
  }): Promise<ChatMessage> {
    try {
      const message = this.repository.create({
        user: messageData.user,
        content: messageData.content,
        role: messageData.role,
        context: messageData.context,
        metadata: messageData.metadata,
        functionCall: messageData.functionCall
      });

      return await this.repository.save(message);
    } catch (error) {
      logger.error('Error saving chat message:', error);
      throw new AppError(500, 'Failed to save chat message');
    }
  }

  async getUserMessages(userId: string): Promise<ChatMessage[]> {
    try {
      return await this.repository.find({
        where: { user: { id: userId } },
        order: { createdAt: 'ASC' },
        relations: ['user']
      });
    } catch (error) {
      logger.error('Error getting user messages:', error);
      throw new AppError(500, 'Failed to get user messages');
    }
  }

  async getThreadMessages(threadId: string, userId: string): Promise<ChatMessage[]> {
    try {
      return await this.repository.find({
        where: { 
          user: { id: userId },
          context: ILike(`%${threadId}%`)
        },
        order: { createdAt: 'ASC' },
        relations: ['user']
      });
    } catch (error) {
      logger.error('Error getting thread messages:', error);
      throw new AppError(500, 'Failed to get thread messages');
    }
  }

  async clearUserHistory(userId: string): Promise<void> {
    try {
      await this.repository.delete({ user: { id: userId } });
    } catch (error) {
      logger.error('Error clearing user history:', error);
      throw new AppError(500, 'Failed to clear user history');
    }
  }
} 