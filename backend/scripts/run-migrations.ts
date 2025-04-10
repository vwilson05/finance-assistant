import { AppDataSource } from '../src/config/database';
import { logger } from '../src/utils/logger';

async function runMigrations() {
  try {
    // Initialize the database connection
    await AppDataSource.initialize();
    logger.info('Database connection established');

    // Run migrations
    logger.info('Running migrations...');
    await AppDataSource.runMigrations();
    logger.info('Migrations completed successfully');

    // Close the connection
    await AppDataSource.destroy();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error running migrations:', error);
    process.exit(1);
  }
}

runMigrations(); 