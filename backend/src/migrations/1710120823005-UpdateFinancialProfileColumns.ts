import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFinancialProfileColumns1710120823005 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create temporary table with new structure
        await queryRunner.query(`
            CREATE TABLE "financial_profiles_temp" (
                "id" varchar PRIMARY KEY,
                "userId" integer,
                "monthlyIncome" decimal(10,2) DEFAULT 0,
                "incomeFrequency" varchar DEFAULT 'monthly',
                "monthlyExpenses" decimal(10,2) DEFAULT 0,
                "totalSavings" decimal(10,2) DEFAULT 0,
                "totalDebt" decimal(10,2) DEFAULT 0,
                "investmentBalance" decimal(10,2) DEFAULT 0,
                "riskTolerance" varchar DEFAULT 'moderate',
                "investmentHorizon" integer DEFAULT 10,
                "currentSavings" decimal(10,2) DEFAULT 0,
                "income" text DEFAULT '{"salary": 0, "other": 0}',
                "expenses" text DEFAULT '{"housing": 0, "transportation": 0, "food": 0, "utilities": 0, "other": 0}',
                "investments" text DEFAULT '{"stocks": 0, "bonds": 0, "realEstate": 0, "other": 0}',
                "debt" text DEFAULT '{"creditCards": 0, "loans": 0, "mortgage": 0, "other": 0}',
                "goals" text DEFAULT '{"shortTerm": [], "mediumTerm": [], "longTerm": []}',
                "financialGoals" text DEFAULT '[]',
                "monthlyBudget" text DEFAULT '[]',
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE
            );
        `);

        // Copy data from old table to new table with correct column mapping
        await queryRunner.query(`
            INSERT INTO "financial_profiles_temp" (
                "id", "userId", "monthlyIncome", "incomeFrequency", "monthlyExpenses",
                "totalSavings", "totalDebt", "investmentBalance", "riskTolerance",
                "investmentHorizon", "currentSavings", "goals", "createdAt", "updatedAt"
            )
            SELECT 
                CAST(id as TEXT), "userId", 
                COALESCE("monthlyIncome", 0), 
                COALESCE("incomeFrequency", 'monthly'),
                COALESCE("monthlyExpenses", 0),
                COALESCE("savings", 0) as "totalSavings",
                COALESCE("debt", 0) as "totalDebt",
                COALESCE("investments", 0) as "investmentBalance",
                COALESCE("riskTolerance", 'moderate'),
                CAST(COALESCE("investmentHorizon", 10) as INTEGER),
                COALESCE("savings", 0) as "currentSavings",
                COALESCE("goals", '{"shortTerm": [], "mediumTerm": [], "longTerm": []}'),
                "createdAt", "updatedAt"
            FROM "financial_profiles";
        `);

        // Drop old table
        await queryRunner.query(`DROP TABLE "financial_profiles";`);

        // Rename temporary table to final name
        await queryRunner.query(`ALTER TABLE "financial_profiles_temp" RENAME TO "financial_profiles";`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Create temporary table with old structure
        await queryRunner.query(`
            CREATE TABLE "financial_profiles_temp" (
                "id" integer PRIMARY KEY AUTOINCREMENT,
                "investmentHorizon" float,
                "riskTolerance" varchar,
                "monthlyIncome" float,
                "monthlyExpenses" float,
                "savings" float,
                "debt" float,
                "investments" float,
                "goals" text,
                "incomeFrequency" varchar DEFAULT 'monthly',
                "userId" integer,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE
            );
        `);

        // Copy data back to old structure
        await queryRunner.query(`
            INSERT INTO "financial_profiles_temp" (
                "investmentHorizon", "riskTolerance", "monthlyIncome", "monthlyExpenses",
                "savings", "debt", "investments", "goals", "incomeFrequency", "userId",
                "createdAt", "updatedAt"
            )
            SELECT 
                "investmentHorizon",
                "riskTolerance",
                "monthlyIncome",
                "monthlyExpenses",
                "totalSavings" as "savings",
                "totalDebt" as "debt",
                "investmentBalance" as "investments",
                "goals",
                "incomeFrequency",
                "userId",
                "createdAt",
                "updatedAt"
            FROM "financial_profiles";
        `);

        // Drop new table
        await queryRunner.query(`DROP TABLE "financial_profiles";`);

        // Rename temporary table to final name
        await queryRunner.query(`ALTER TABLE "financial_profiles_temp" RENAME TO "financial_profiles";`);
    }
} 