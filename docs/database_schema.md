# Database Schema

This document outlines the database schema for the Personal Financial Assistant application.

## Overview

The database schema is designed to support the core functionalities of the application, including user management, financial profiling, investment tracking, and AI-powered strategy generation.

## Tables

### User
- Primary user information and authentication
- Fields:
  - `id`: Primary key
  - `email`: Unique email address
  - `hashed_password`: Securely hashed password
  - `full_name`: User's full name
  - `role`: User role (admin/user)
  - `is_active`: Account status
  - `created_at`: Account creation timestamp
  - `updated_at`: Last update timestamp

### FinancialProfile
- Comprehensive financial information for each user
- Fields:
  - `id`: Primary key
  - `user_id`: Foreign key to User
  - `age`: User's age
  - `employment_status`: Current employment status
  - `annual_income`: Annual income
  - `primary_goal`: Primary investment goal
  - `target_amount`: Target investment amount
  - `target_date`: Target date for goal
  - `risk_tolerance`: Risk tolerance level
  - `investment_experience`: Level of investment experience
  - `current_savings`: Current savings amount
  - `current_investments`: JSON of current investments
  - `monthly_expenses`: Monthly expenses
  - `debt_amount`: Current debt amount
  - `created_at`: Profile creation timestamp
  - `updated_at`: Last update timestamp

### InvestmentAccount
- Investment accounts information
- Fields:
  - `id`: Primary key
  - `profile_id`: Foreign key to FinancialProfile
  - `account_type`: Type of account
  - `account_name`: Name of the account
  - `institution`: Financial institution
  - `account_number`: Last 4 digits of account
  - `balance`: Current balance
  - `holdings`: JSON of current holdings
  - `performance_history`: JSON of performance history
  - `contribution_history`: JSON of contribution history
  - `created_at`: Account creation timestamp
  - `updated_at`: Last update timestamp

### InvestmentTransaction
- Investment transaction records
- Fields:
  - `id`: Primary key
  - `account_id`: Foreign key to InvestmentAccount
  - `transaction_type`: Type of transaction
  - `transaction_date`: Date of transaction
  - `amount`: Transaction amount
  - `description`: Transaction description
  - `symbol`: Investment symbol (if applicable)
  - `shares`: Number of shares (if applicable)
  - `price_per_share`: Price per share (if applicable)
  - `metadata`: Additional transaction details
  - `created_at`: Transaction creation timestamp
  - `updated_at`: Last update timestamp

### InvestmentStrategy
- AI-generated investment strategies
- Fields:
  - `id`: Primary key
  - `user_id`: Foreign key to User
  - `name`: Strategy name
  - `description`: Strategy description
  - `status`: Strategy status
  - `target_return`: Target return rate
  - `risk_level`: Risk level
  - `time_horizon`: Investment time horizon
  - `asset_allocation`: JSON of asset allocation
  - `recommended_holdings`: JSON of recommended holdings
  - `performance_metrics`: JSON of performance metrics
  - `is_automated`: Whether strategy is automated
  - `created_at`: Strategy creation timestamp
  - `updated_at`: Last update timestamp

### ChatHistory
- User interactions with AI assistant
- Fields:
  - `id`: Primary key
  - `user_id`: Foreign key to User
  - `strategy_id`: Foreign key to InvestmentStrategy
  - `user_message`: User's message
  - `assistant_response`: AI assistant's response
  - `context`: JSON of conversation context
  - `metadata`: Additional conversation metadata
  - `created_at`: Message creation timestamp
  - `updated_at`: Last update timestamp

## Relationships

- User (1) -> (1) FinancialProfile
- User (1) -> (many) InvestmentStrategy
- User (1) -> (many) ChatHistory
- FinancialProfile (1) -> (many) InvestmentAccount
- InvestmentAccount (1) -> (many) InvestmentTransaction
- InvestmentStrategy (1) -> (many) ChatHistory

## Indexes

- User: email (unique)
- FinancialProfile: user_id (unique)
- InvestmentAccount: profile_id
- InvestmentTransaction: account_id
- InvestmentStrategy: user_id
- ChatHistory: user_id, strategy_id 