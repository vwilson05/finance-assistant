import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNameColumnToUser1710120823000 implements MigrationInterface {
    name = 'AddNameColumnToUser1710120823000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if the column already exists
        const tableInfo = await queryRunner.query(`PRAGMA table_info(users)`);
        const nameColumnExists = tableInfo.some((column: any) => column.name === 'name');
        
        if (!nameColumnExists) {
            await queryRunner.query(`ALTER TABLE "users" ADD "name" varchar`);
            
            // Update existing users with a default name based on firstName and lastName if they exist
            await queryRunner.query(`
                UPDATE "users" 
                SET "name" = CASE 
                    WHEN "firstName" IS NOT NULL AND "lastName" IS NOT NULL 
                    THEN "firstName" || ' ' || "lastName"
                    WHEN "firstName" IS NOT NULL 
                    THEN "firstName"
                    WHEN "lastName" IS NOT NULL 
                    THEN "lastName"
                    ELSE 'User'
                END
                WHERE "name" IS NULL
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Check if the column exists before trying to drop it
        const tableInfo = await queryRunner.query(`PRAGMA table_info(users)`);
        const nameColumnExists = tableInfo.some((column: any) => column.name === 'name');
        
        if (nameColumnExists) {
            await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        }
    }
} 