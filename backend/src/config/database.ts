import { logger } from '../utils/logger';
import { AppDataSource } from '../data-source';
import { config } from './index';

export { AppDataSource };

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