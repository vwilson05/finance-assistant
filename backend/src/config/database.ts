import { DataSource } from 'typeorm';
import { logger } from '../utils/logger';
import { User } from '../models/User';
import { FinancialProfile } from '../models/FinancialProfile';
import { Strategy } from '../models/Strategy';
import { ChatMessage } from '../models/ChatMessage';
import { config } from './index';
import path from 'path';

// Database configuration with security best practices
export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: config.database.url.replace('sqlite:', ''),
  synchronize: false, // Disable auto-synchronization in all environments
  logging: config.nodeEnv === 'development',
  entities: [User, FinancialProfile, Strategy, ChatMessage],
  migrations: [path.join(__dirname, '../migrations/*.ts')],
  subscribers: [path.join(__dirname, '../subscribers/**/*.ts')],
  migrationsRun: true, // Automatically run migrations on startup
  // Enable SQLite security features
  extra: {
    // Enable WAL mode for better concurrency
    pragma: [
      'journal_mode=WAL',
      'synchronous=NORMAL',
      'foreign_keys=ON',
      'secure_delete=ON',
    ],
  },
  // Set maximum query execution time (5 seconds)
  maxQueryExecutionTime: 5000,
});

export const setupDatabase = async () => {
  try {
    await AppDataSource.initialize();
    logger.info('Database connection established');

    // Run migrations instead of auto-synchronization
    if (config.nodeEnv !== 'production') {
      logger.info('Running migrations...');
      await AppDataSource.runMigrations();
      logger.info('Migrations completed successfully');
    }

    // Verify foreign key constraints
    await AppDataSource.query('PRAGMA foreign_keys = ON;');
    const foreignKeysEnabled = await AppDataSource.query('PRAGMA foreign_keys;');
    if (foreignKeysEnabled[0]['foreign_keys'] === 1) {
      logger.info('Foreign key constraints enabled');
    } else {
      throw new Error('Failed to enable foreign key constraints');
    }

    // Enable secure deletion
    await AppDataSource.query('PRAGMA secure_delete = ON;');
    logger.info('Secure deletion enabled');

  } catch (error) {
    logger.error('Error setting up database:', error);
    throw error;
  }
}; 