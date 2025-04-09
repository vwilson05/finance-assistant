import { DataSource } from 'typeorm';
import { logger } from '../utils/logger';
import { User } from '../models/User';
import { FinancialProfile } from '../models/FinancialProfile';
import { Strategy } from '../models/Strategy';
import { ChatMessage } from '../models/ChatMessage';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DB_NAME || 'financial_assistant.db',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
  entities: [User, FinancialProfile, Strategy, ChatMessage],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
});

export const setupDatabase = async () => {
  try {
    await AppDataSource.initialize();
    logger.info('Database connection established');

    // Create tables if they don't exist (development only)
    if (process.env.NODE_ENV !== 'production') {
      await AppDataSource.synchronize();
      logger.info('Database schema synchronized');
    }
  } catch (error) {
    logger.error('Error connecting to database:', error);
    throw error;
  }
}; 