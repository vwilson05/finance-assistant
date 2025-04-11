## Overview
This document contains all the essential technical and functional details for the Personal Financial Advisor app. It covers API endpoints, database schemas, function specifications, and architectural decisions.

## API Endpoints
| Endpoint                               | Method | Description                                                        | Parameters                        | Response                              |
|----------------------------------------|--------|--------------------------------------------------------------------|-----------------------------------|---------------------------------------|
| `/api/user/profile`                    | GET    | Retrieve user financial profile                                    | User ID                           | User profile object                   |
| `/api/user/profile`                    | POST   | Create or update user profile                                      | Profile data in JSON              | Updated profile confirmation          |
| `/api/user/openai-key`                 | GET    | Check if user has OpenAI API key set                               | None (uses auth token)            | `{ hasApiKey: boolean }`             |
| `/api/user/openai-key`                 | PUT    | Set or update user's OpenAI API key                                | `{ openaiApiKey: string }`        | Success confirmation                  |
| `/api/strategy`                        | GET    | List all strategies for a user                                     | User ID                           | Array of strategy objects             |
| `/api/strategy`                        | POST   | Generate a tailored financial strategy based on user profile        | User ID, strategy type            | Strategy object                       |
| `/api/chat`                            | POST   | Send a message to the AI chatbot                                   | User ID, message                  | AI response                           |

## Database Schemas
### Users Table
- **Table Name:** users
- **Fields:**
  - `id`: Primary Key, UUID.
  - `email`: User's email address (unique).
  - `password`: Hashed password.
  - `firstName`: User's first name.
  - `lastName`: User's last name.
  - `openaiApiKey`: User's OpenAI API key (nullable).
  - `createdAt`: Timestamp of account creation.
  - `updatedAt`: Timestamp of last update.

### Financial Profiles Table
- **Table Name:** financial_profiles
- **Fields:**
  - `id`: Primary Key, UUID.
  - `userId`: Foreign key to users table.
  - `monthlyIncome`: Monthly income amount.
  - `monthlyExpenses`: Monthly expenses amount.
  - `totalSavings`: Total savings amount.
  - `totalDebt`: Total debt amount.
  - `riskTolerance`: Risk tolerance level (low, moderate, high).
  - `financialGoals`: JSON array of financial goals.
  - `createdAt`: Timestamp of profile creation.
  - `updatedAt`: Timestamp of last update.

### Strategies Table
- **Table Name:** strategies
- **Fields:**
  - `id`: Primary Key, UUID.
  - `userId`: Foreign key to users table.
  - `type`: Strategy type (savings, investment, debt_reduction, retirement, emergency_fund).
  - `name`: Strategy name.
  - `description`: Strategy description.
  - `recommendations`: JSON array of recommendations.
  - `milestones`: JSON array of milestones.
  - `status`: Strategy status (active, completed, abandoned).
  - `createdAt`: Timestamp of strategy creation.
  - `updatedAt`: Timestamp of last update.

### Chat Messages Table
- **Table Name:** chat_messages
- **Fields:**
  - `id`: Primary Key, UUID.
  - `userId`: Foreign key to users table.
  - `role`: Message role (user, assistant, system).
  - `content`: Message content.
  - `context`: JSON object with context information.
  - `createdAt`: Timestamp of message creation.

## Function Specifications
### Example: generateFinancialStrategy
- **Purpose:** Generate a personalized financial strategy based on user profile and goals.
- **Inputs:** User ID, strategy type.
- **Outputs:** Comprehensive financial strategy with actionable steps and timeline.
- **Edge Cases:** Handle insufficient data scenarios with appropriate user prompts.

## Project Structure
The project follows a modern full-stack architecture with clear separation between frontend and backend:

### Frontend (React + TypeScript)
- **Components**: Well-organized component structure with Features, FeatureCard, Hero, Layout, and Navigation components
- **Pages**: Complete set of pages including Home, Register, Login, Profile, and Dashboard
- **Services**: API integration services
- **Types**: TypeScript type definitions
- **Utils**: Utility functions
- **Styles**: Global styling and theming

### Backend (Node.js + Express + TypeScript)
- **Routes**: Well-defined API routes for AI, User, Financial Profile, Chat, and Strategy
- **Controllers**: Corresponding controllers for each route
- **Services**: AI service implementation with vector store and Ollama integration
- **Models**: Data models for User, FinancialProfile, Strategy, and ChatMessage
- **Middleware**: Authentication, validation, and error handling
- **Config**: Database and general configuration
- **Utils**: Password hashing, JWT, and logging utilities

## Architectural Decisions
Refer to [architecture.md](./architecture.md) for detailed discussions on system architecture and technology stack choices.

---