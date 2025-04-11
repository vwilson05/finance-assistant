import { AppDataSource, setupDatabase } from '../src/data-source';
import { User } from '../src/models/User';
import { FinancialProfile } from '../src/models/FinancialProfile';
import { ChatMessage } from '../src/models/ChatMessage';
import { logger } from '../src/utils/logger';

async function runMigrations() {
    try {
        await setupDatabase();
        logger.info('Starting migrations...');

        // Check if migrations table exists
        const migrationsTableExists = await AppDataSource.query(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='migrations'"
        );

        if (!migrationsTableExists.length) {
            logger.info('Creating migrations table...');
            await AppDataSource.query(`
                CREATE TABLE migrations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
        }

        // Run migrations in sequence
        const migrations = [
            {
                name: 'create_users_table',
                sql: `
                    CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        email TEXT UNIQUE NOT NULL,
                        password_hash TEXT NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                `
            },
            {
                name: 'create_financial_profiles_table',
                sql: `
                    CREATE TABLE IF NOT EXISTS financial_profiles (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER NOT NULL,
                        income REAL,
                        expenses REAL,
                        savings REAL,
                        goals TEXT,
                        risk_tolerance TEXT,
                        investment_horizon TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                    )
                `
            },
            {
                name: 'create_chat_messages_table',
                sql: `
                    CREATE TABLE IF NOT EXISTS chat_messages (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER NOT NULL,
                        role TEXT NOT NULL,
                        content TEXT NOT NULL,
                        context TEXT,
                        metadata TEXT,
                        function_call TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                    )
                `
            }
        ];

        for (const migration of migrations) {
            const migrationExists = await AppDataSource.query(
                'SELECT id FROM migrations WHERE name = ?',
                [migration.name]
            );

            if (!migrationExists.length) {
                logger.info(`Running migration: ${migration.name}`);
                await AppDataSource.query(migration.sql);
                await AppDataSource.query(
                    'INSERT INTO migrations (name) VALUES (?)',
                    [migration.name]
                );
                logger.info(`Migration ${migration.name} completed successfully`);
            } else {
                logger.info(`Migration ${migration.name} already executed, skipping`);
            }
        }

        logger.info('All migrations completed successfully');
    } catch (error) {
        logger.error('Error running migrations:', error);
        process.exit(1);
    } finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
            logger.info('Database connection closed');
        }
    }
}

// Run migrations if this file is executed directly
if (require.main === module) {
    runMigrations().catch(error => {
        logger.error('Migration failed:', error);
        process.exit(1);
    });
} 