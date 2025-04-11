import { DataSource } from 'typeorm';
import { User } from './models/User';
import { FinancialProfile } from './models/FinancialProfile';
import { ChatMessage } from './models/ChatMessage';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'financial_assistant.db',
  entities: [User, FinancialProfile, ChatMessage],
  synchronize: false, // We'll use migrations instead
  logging: true,
});

export async function setupDatabase() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('Database connection established');

      // Enable foreign key constraints
      await AppDataSource.query('PRAGMA foreign_keys = ON;');
      
      // Set journal mode to WAL for better concurrency
      await AppDataSource.query('PRAGMA journal_mode = WAL;');
      
      // Enable synchronous mode for better durability
      await AppDataSource.query('PRAGMA synchronous = NORMAL;');
      
      // Set busy timeout to handle concurrent access better
      await AppDataSource.query('PRAGMA busy_timeout = 5000;');
    }
  } catch (error) {
    console.error('Error during database setup:', error);
    throw error;
  }
} 