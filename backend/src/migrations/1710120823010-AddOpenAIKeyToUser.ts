import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOpenAIKeyToUser1710120823010 implements MigrationInterface {
    name = 'AddOpenAIKeyToUser1710120823010'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "openaiApiKey" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "openaiApiKey"`);
    }
} 