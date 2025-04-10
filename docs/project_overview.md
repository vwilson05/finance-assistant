## Project Summary
The Personal Financial Advisor app is an AI-powered personal finance tool designed to replace the need for high-priced financial advisors. It helps users build tailored investment strategies and adapt plans dynamically based on market conditions through interactive, data-driven insights.

## User Flow
The application follows a comprehensive user flow:

1. **Profile Creation**: Users create detailed financial profiles with income, expenses, savings, debt, and risk tolerance.
2. **AI Understanding**: The AI analyzes the user's financial situation and understands their unique circumstances.
3. **Goal Development**: The AI helps users develop realistic and achievable financial goals.
4. **Plan Creation**: The AI develops a personalized financial plan and exposes it in the app.
5. **Plan Execution**: Users input changes to their data after acting on the plan.
6. **Oversight & Adaptation**: The AI oversees plan execution and suggests changes based on the user's financial picture, market news, and other factors.

## Objectives
- **Personalized Financial Profiling:** Establish a comprehensive financial baseline.
- **Tailored Investment Strategies:** Design customized, actionable financial plans.
- **Interactive Guidance:** Provide on-demand, AI-driven advice through a conversational chatbot.
- **Dynamic Adaptability:** Adjust plans based on market trends and macroeconomic factors.

## Scope
- **Initial Version:** Manual data entry for profiles and investments.
- **Future Enhancements:** Integration with financial institutions and real-time data feeds.

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

### Database
- SQLite database with TypeORM
- Migrations and seeds for database management

### Documentation
Comprehensive documentation in the `docs` directory covering project overview, architecture, features, database schema and setup, UI/UX guidelines, milestones, and issues tracking.

## Getting Started
To start the application, run the following command:
```bash
./start.sh
```

This will install all dependencies and start both the frontend and backend servers.

---