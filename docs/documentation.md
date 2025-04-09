## Overview
This document contains all the essential technical and functional details for the Personal Financial Advisor app. It covers API endpoints, database schemas, function specifications, and architectural decisions.

## API Endpoints
| Endpoint                               | Method | Description                                                        | Parameters                        | Response                              |
|----------------------------------------|--------|--------------------------------------------------------------------|-----------------------------------|---------------------------------------|
| `/api/user/profile`                    | GET    | Retrieve user financial profile                                    | User ID                           | User profile object                   |
| `/api/user/profile`                    | POST   | Create or update user profile                                      | Profile data in JSON              | Updated profile confirmation          |
| `/api/investments`                     | GET    | List all investment accounts and details                           | Optional filters (e.g., type)     | Array of investment objects           |
| `/api/plan/generate`                   | POST   | Generate a tailored financial plan based on provided goals          | Goal parameters, profile data     | Detailed financial plan object        |
| `/api/chatbot/query`                   | POST   | Ask financial strategy questions and get AI-driven responses         | User query                        | Response object with recommendations  |

## Database Schemas
### Users Table
- **Table Name:** users
- **Fields:**
  - `id`: Primary Key, unique identifier.
  - `name`: User’s full name.
  - `employment`: Employment details.
  - `location`: Residential location.
  - `income`: Gross income details.
  - `profile_data`: JSON field for additional financial details.

### Investments Table
- **Table Name:** investments
- **Fields:**
  - `id`: Primary Key.
  - `user_id`: Foreign key to users table.
  - `account_type`: Type of investment account.
  - `balance`: Current balance or invested amount.
  - `details`: JSON field for additional account info.

### Goals Table
- **Table Name:** goals
- **Fields:**
  - `id`: Primary Key.
  - `user_id`: Foreign key to users table.
  - `goal_type`: Type of financial goal (retirement, purchase, etc.).
  - `target_amount`: Numeric value indicating the goal.
  - `timeline`: Planned duration for achieving the goal.

## Function Specifications
### Example: generateFinancialPlan
- **Purpose:** Generate a personalized financial plan based on user profile and set goals.
- **Inputs:** User profile data, set goals, current investment details.
- **Outputs:** Comprehensive financial plan with actionable steps and timeline.
- **Edge Cases:** Handle insufficient data scenarios with appropriate user prompts.

## Architectural Decisions
Refer to [architecture.md](./architecture.md) for detailed discussions on system architecture and technology stack choices.

---