# Database Schema Documentation

## Overview
The Financial Assistant application uses SQLite as its database, managed through TypeORM. The schema is designed to support user management, financial profiling, strategy generation, and AI-powered chat interactions.

## Entities

### User
- **Table**: `users`
- **Description**: Stores user account information
- **Fields**:
  - `id` (UUID, Primary Key)
  - `email` (String, Unique)
  - `password` (String, Hashed)
  - `firstName` (String)
  - `lastName` (String)
  - `dateOfBirth` (Date)
  - `createdAt` (Timestamp)
  - `updatedAt` (Timestamp)
- **Relationships**:
  - One-to-One with FinancialProfile

### FinancialProfile
- **Table**: `financial_profiles`
- **Description**: Stores user financial information and preferences
- **Fields**:
  - `id` (UUID, Primary Key)
  - `userId` (UUID, Foreign Key)
  - `monthlyIncome` (Decimal)
  - `incomeFrequency` (Enum: weekly, biweekly, monthly, annually)
  - `monthlyExpenses` (Decimal)
  - `totalSavings` (Decimal)
  - `totalDebt` (Decimal)
  - `investmentBalance` (Decimal)
  - `riskTolerance` (Enum: low, moderate, high)
  - `financialGoals` (JSON Array)
  - `monthlyBudget` (JSON Array)
  - `createdAt` (Timestamp)
  - `updatedAt` (Timestamp)
- **Relationships**:
  - One-to-One with User

### Strategy
- **Table**: `strategies`
- **Description**: Stores financial strategies generated for users
- **Fields**:
  - `id` (UUID, Primary Key)
  - `userId` (UUID, Foreign Key)
  - `type` (Enum: savings, investment, debt_reduction, retirement, emergency_fund)
  - `name` (String)
  - `description` (Text)
  - `recommendations` (JSON Array)
  - `milestones` (JSON Array)
  - `targetAmount` (Decimal, Optional)
  - `targetDate` (Date, Optional)
  - `status` (Enum: active, completed, abandoned)
  - `progress` (JSON Object)
  - `createdAt` (Timestamp)
  - `updatedAt` (Timestamp)
- **Relationships**:
  - Many-to-One with User

### ChatMessage
- **Table**: `chat_messages`
- **Description**: Stores AI chat interactions with users
- **Fields**:
  - `id` (UUID, Primary Key)
  - `userId` (UUID, Foreign Key)
  - `role` (Enum: user, assistant, system)
  - `content` (Text)
  - `context` (JSON Object)
  - `metadata` (JSON Object)
  - `createdAt` (Timestamp)
- **Relationships**:
  - Many-to-One with User

## JSON Structures

### FinancialGoals
```json
{
  "type": "string",
  "targetAmount": "number",
  "targetDate": "Date",
  "priority": "number"
}
```

### MonthlyBudget
```json
{
  "category": "string",
  "amount": "number",
  "actual": "number?"
}
```

### StrategyRecommendations
```json
{
  "action": "string",
  "priority": "number",
  "timeframe": "string",
  "expectedImpact": "string"
}
```

### StrategyMilestones
```json
{
  "description": "string",
  "targetDate": "Date",
  "completed": "boolean"
}
```

### StrategyProgress
```json
{
  "currentAmount": "number",
  "lastUpdated": "Date",
  "notes": "string"
}
```

### ChatContext
```json
{
  "relatedStrategy": "string?",
  "financialMetrics": [
    {
      "metric": "string",
      "value": "number"
    }
  ],
  "userIntent": "string?"
}
```

### ChatMetadata
```json
{
  "tokens": "number",
  "processingTime": "number",
  "model": "string"
}
```

## Notes
- All timestamps are automatically managed by TypeORM
- UUIDs are used for all primary keys to ensure uniqueness across distributed systems
- JSON fields are used for flexible data structures that may evolve over time
- Enums are used to restrict certain fields to predefined values
- Foreign keys are automatically indexed by TypeORM 