import { AppDataSource, setupDatabase } from '../src/data-source';
import { User } from '../src/models/User';
import { logger } from '../src/utils/logger';

async function deleteAllUsers() {
  try {
    await setupDatabase();
    logger.info('Connected to database');
    
    const userRepository = AppDataSource.getRepository(User);
    
    // Get all users
    const users = await userRepository.find();
    logger.info(`Found ${users.length} users to delete`);
    
    if (users.length === 0) {
      logger.info('No users to delete');
      return;
    }
    
    // Delete all users
    await userRepository.remove(users);
    logger.info('All users deleted successfully');
    
    // Close the connection
    await AppDataSource.destroy();
    logger.info('Database connection closed');
    
    console.log('All users have been deleted from the database.');
  } catch (error) {
    logger.error('Error deleting users:', error);
    console.error('Failed to delete users:', error);
  }
}

// Run the function
deleteAllUsers(); 