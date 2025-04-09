import { DataSource } from 'typeorm';
import { logger } from '../utils/logger';
import { User } from '../models/User';
import { FinancialProfile } from '../models/FinancialProfile';
import { Strategy } from '../models/Strategy';
import { ChatMessage } from '../models/ChatMessage';
import { config } from './index';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: config.database.url.replace('sqlite:', ''),
  synchronize: config.nodeEnv !== 'production',
  logging: config.nodeEnv !== 'production',
  entities: [User, FinancialProfile, Strategy, ChatMessage],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
});

export const setupDatabase = async () => {
  try {
    await AppDataSource.initialize();
    logger.info('Database connection established');

    // Create tables if they don't exist (development only)
    if (config.nodeEnv !== 'production') {
      await AppDataSource.synchronize();
      logger.info('Database schema synchronized');
    }
  } catch (error) {
    logger.error('Error connecting to database:', error);
    throw error;
  }
}; 