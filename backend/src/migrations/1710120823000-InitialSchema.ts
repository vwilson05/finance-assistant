import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1710120823000 implements MigrationInterface {
    name = 'InitialSchema1710120823000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create users table
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" varchar PRIMARY KEY,
                "name" varchar,
                "email" varchar UNIQUE,
                "password" varchar NOT NULL,
                "firstName" varchar NOT NULL,
                "lastName" varchar NOT NULL,
                "dateOfBirth" date NOT NULL,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
            )
        `);

        // Create financial_profiles table
        await queryRunner.query(`
            CREATE TABLE "financial_profiles" (
                "id" varchar PRIMARY KEY,
                "userId" varchar UNIQUE,
                "netWorth" decimal(15,2) DEFAULT 0,
                "monthlyIncome" decimal(15,2) DEFAULT 0,
                "monthlyExpenses" decimal(15,2) DEFAULT 0,
                "riskTolerance" decimal(5,2) DEFAULT 0,
                "investmentHorizon" integer DEFAULT 0,
                "currentSavings" decimal(15,2) DEFAULT 0,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE
            )
        `);

        // Create chat_messages table
        await queryRunner.query(`
            CREATE TABLE "chat_messages" (
                "id" varchar PRIMARY KEY,
                "userId" varchar,
                "role" varchar NOT NULL,
                "content" text NOT NULL,
                "context" text,
                "metadata" text,
                "functionCall" text,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE
            )
        `);

        // Create strategies table
        await queryRunner.query(`
            CREATE TABLE "strategies" (
                "id" varchar PRIMARY KEY,
                "userId" varchar,
                "type" varchar NOT NULL,
                "name" varchar NOT NULL,
                "description" text NOT NULL,
                "recommendations" text NOT NULL,
                "milestones" text NOT NULL,
                "targetAmount" decimal(10,2),
                "targetDate" date,
                "status" varchar NOT NULL DEFAULT 'active',
                "progress" text,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "strategies"`);
        await queryRunner.query(`DROP TABLE "chat_messages"`);
        await queryRunner.query(`DROP TABLE "financial_profiles"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
} 