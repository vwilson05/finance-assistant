import { AppDataSource, setupDatabase } from '../data-source';

interface Migration {
  name: string;
  up: string;
  down: string;
}

const migrations: Migration[] = [
  {
    name: '001_create_users_table',
    up: `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        dateOfBirth DATE NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
    down: 'DROP TABLE IF EXISTS users;'
  },
  {
    name: '002_create_financial_profiles_table',
    up: `
      CREATE TABLE IF NOT EXISTS financial_profiles (
        id VARCHAR(36) PRIMARY KEY,
        userId VARCHAR(36) NOT NULL,
        netWorth DECIMAL(15,2) DEFAULT 0,
        monthlyIncome DECIMAL(15,2) DEFAULT 0,
        monthlyExpenses DECIMAL(15,2) DEFAULT 0,
        riskTolerance DECIMAL(5,2) DEFAULT 0,
        investmentHorizon INTEGER DEFAULT 0,
        currentSavings DECIMAL(15,2) DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      );
    `,
    down: 'DROP TABLE IF EXISTS financial_profiles;'
  },
  {
    name: '003_create_chat_messages_table',
    up: `
      CREATE TABLE IF NOT EXISTS chat_messages (
        id VARCHAR(36) PRIMARY KEY,
        userId VARCHAR(36) NOT NULL,
        content TEXT NOT NULL,
        role VARCHAR(50) NOT NULL,
        context TEXT,
        metadata TEXT,
        functionCall TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(userId);
    `,
    down: 'DROP TABLE IF EXISTS chat_messages;'
  },
  {
    name: '004_add_openai_key_to_users',
    up: `
      ALTER TABLE users ADD COLUMN openaiApiKey VARCHAR(255);
    `,
    down: `
      ALTER TABLE users DROP COLUMN openaiApiKey;
    `
  }
];

async function runMigrations() {
  try {
    await setupDatabase();

    // Drop existing tables in reverse order
    console.log('Dropping existing tables...');
    await AppDataSource.query('DROP TABLE IF EXISTS migrations;');
    await AppDataSource.query('DROP TABLE IF EXISTS chat_messages;');
    await AppDataSource.query('DROP TABLE IF EXISTS financial_profiles;');
    await AppDataSource.query('DROP TABLE IF EXISTS users;');

    // Create migrations table if it doesn't exist
    await AppDataSource.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    for (const migration of migrations) {
      // Check if migration has already been executed
      const result = await AppDataSource.query(
        'SELECT name FROM migrations WHERE name = ?',
        [migration.name]
      );

      if (result.length === 0) {
        console.log(`Running migration: ${migration.name}`);
        
        // Start a transaction
        await AppDataSource.query('BEGIN TRANSACTION');
        
        try {
          // Run the migration
          await AppDataSource.query(migration.up);
          
          // Record the migration
          await AppDataSource.query(
            'INSERT INTO migrations (name) VALUES (?)',
            [migration.name]
          );
          
          // Commit the transaction
          await AppDataSource.query('COMMIT');
          console.log(`Migration ${migration.name} completed successfully`);
        } catch (error) {
          // Rollback the transaction on error
          await AppDataSource.query('ROLLBACK');
          throw error;
        }
      } else {
        console.log(`Migration ${migration.name} already executed, skipping`);
      }
    }

    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  } finally {
    // Close the database connection
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations();
} 