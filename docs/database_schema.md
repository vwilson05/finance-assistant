# Database Schema Documentation

## Overview
The Financial Assistant application uses SQLite as its database, managed through TypeORM. The schema is designed to support user management, financial profiling, strategy generation, and AI-powered chat interactions.

## Entities

### User
- **Table**: `users`
- **Description**: Stores user account information and OpenAI API key for personalized AI interactions
- **Fields**:
  - `id` (UUID, Primary Key)
  - `email` (String, Unique)
  - `password` (String, Hashed)
  - `firstName` (String)
  - `lastName` (String)
  - `name` (String)
  - `dateOfBirth` (Date)
  - `openaiApiKey` (String, Nullable) - Used for personalized AI interactions
  - `createdAt` (Timestamp)
  - `updatedAt` (Timestamp)
- **Relationships**:
  - One-to-One with FinancialProfile
  - One-to-Many with ChatMessage
- **Notes**:
  - The `openaiApiKey` field is optional and allows users to provide their own OpenAI API key for personalized AI interactions
  - When `openaiApiKey` is not provided, the system uses a default key for basic functionality
  - The key is stored securely and is only used for the specific user's AI interactions

### FinancialProfile
- **Table**: `financial_profiles`