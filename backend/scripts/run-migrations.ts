import { AppDataSource } from '../src/config/database';
import { logger } from '../src/utils/logger';

async function runMigrations() {
    try {
        // Initialize the database connection
        await AppDataSource.initialize();
        logger.info('Database connection established');

        // Run migrations
        logger.info('Running migrations...');
        
        // Get the query runner
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        
        try {
            // Check if migrations table exists
            const migrationsTableExists = await queryRunner.query(`
                SELECT name FROM sqlite_master 
                WHERE type='table' AND name='migrations'
            `);
            
            if (migrationsTableExists.length === 0) {
                // Create migrations table if it doesn't exist
                await queryRunner.query(`
                    CREATE TABLE "migrations" (
                        "id" integer PRIMARY KEY AUTOINCREMENT,
                        "timestamp" bigint NOT NULL,
                        "name" varchar NOT NULL
                    )
                `);
            }
            
            // Get existing migrations
            const existingMigrations = await queryRunner.query(`
                SELECT * FROM migrations ORDER BY timestamp DESC
            `);
            
            // Define our migrations in order
            const migrations = [
                {
                    timestamp: 1710120823000,
                    name: 'AddNameColumnToUser1710120823000',
                    module: '../src/migrations/1710120823000-AddNameColumnToUser'
                },
                {
                    timestamp: 1710120823005,
                    name: 'UpdateFinancialProfileColumns1710120823005',
                    module: '../src/migrations/1710120823005-UpdateFinancialProfileColumns'
                }
            ];
            
            // Run each migration in sequence
            for (const migrationInfo of migrations) {
                // Check if migration has already been run
                const migrationExists = existingMigrations.some(
                    (m: any) => m.timestamp === migrationInfo.timestamp
                );
                
                if (!migrationExists) {
                    // Load and instantiate the migration
                    const migration = new (require(migrationInfo.module)[migrationInfo.name])();
                    
                    // Run the migration
                    await migration.up(queryRunner);
                    
                    // Record the migration
                    await queryRunner.query(`
                        INSERT INTO "migrations"("timestamp", "name") 
                        VALUES (?, ?)
                    `, [migrationInfo.timestamp, migrationInfo.name]);
                    
                    logger.info(`Migration ${migrationInfo.name} executed successfully`);
                } else {
                    logger.info(`Migration ${migrationInfo.name} already applied`);
                }
            }
            
            // Commit the transaction
            await queryRunner.commitTransaction();
        } catch (error) {
            // Rollback the transaction on error
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            // Release the query runner
            await queryRunner.release();
        }
        
        logger.info('Migrations completed successfully');
    } catch (error) {
        logger.error('Error running migrations:', error);
        throw error;
    } finally {
        // Close the database connection
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
            logger.info('Database connection closed');
        }
    }
}

// Run the migrations
runMigrations().catch(error => {
    logger.error('Migration failed:', error);
    process.exit(1);
}); 