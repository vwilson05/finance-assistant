## Architectural Overview
The Personal Financial Advisor app is designed as an AI-powered tool to replace expensive financial advisory services. The system integrates user inputs, manual financial data, and real-time market information to generate tailored investment strategies and dynamic financial plans.

## User Flow Architecture
The application follows a comprehensive user flow that is supported by the system architecture:

1. **Profile Creation**: Users create detailed financial profiles with income, expenses, savings, debt, and risk tolerance.
   - Frontend: Profile creation forms and validation
   - Backend: Financial profile API endpoints
   - Database: Financial profile storage

2. **AI Understanding**: The AI analyzes the user's financial situation and understands their unique circumstances.
   - Frontend: Profile analysis visualization
   - Backend: AI service with vector store integration
   - Database: Vector embeddings of financial data

3. **Goal Development**: The AI helps users develop realistic and achievable financial goals.
   - Frontend: Goal suggestion UI and goal creation forms
   - Backend: Goal suggestion algorithm and goal management API
   - Database: Goal storage and tracking

4. **Plan Creation**: The AI develops a personalized financial plan and exposes it in the app.
   - Frontend: Plan visualization and actionable items
   - Backend: Plan generation algorithm and plan management API
   - Database: Plan storage and tracking

5. **Plan Execution**: Users input changes to their data after acting on the plan.
   - Frontend: Progress tracking UI and data update forms
   - Backend: Progress tracking API and data update endpoints
   - Database: Progress and data update storage

6. **Oversight & Adaptation**: The AI oversees plan execution and suggests changes based on the user's financial picture, market news, and other factors.
   - Frontend: Adaptation suggestions UI and notification system
   - Backend: Market data integration and adaptation algorithm
   - Database: Market data and adaptation history storage

## Design Principles
- **Modularity:** Separate concerns such as the frontend interface, backend APIs, AI-based analytics, and notification systems.
- **Scalability:** Allow future integration with financial institutions and real-time data feeds.
- **Maintainability:** Ensure clear code structure and extensive documentation for continuous improvement.
- **Security:** Protect sensitive financial data with robust encryption and authentication mechanisms.

## Core Components
- **Frontend:** React-based responsive web interface featuring a modern, clean design with light/dark mode.
- **Backend API:** Express.js RESTful endpoints to handle user profiles, financial data management, and plan generation.
- **AI Engine:** Processes financial profiles, market data, and user goals to generate investment strategies and recommendations.
- **Chatbot Advisor:** An interactive module allowing users to ask questions like "Should I sell my real estate holdings?" and receive data-driven responses.
- **Database:** SQLite storage of user data, financial profiles, investment accounts, goals, and plan history.
- **Vector Store:** ChromaDB for storing and retrieving financial context and embeddings.

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

## Key Architectural Decisions
| Decision ID | Description                                            | Date    | Rationale                                                  |
|-------------|--------------------------------------------------------|---------|------------------------------------------------------------|
| AD-001      | Use RESTful API for data operations                    | [Date]  | Simplicity and standard integration across modules         |
| AD-002      | Modular separation of AI, UI, and Database layers      | [Date]  | Easier maintenance and future extensibility                |
| AD-003      | Integrate a chatbot advisor for interactive guidance   | [Date]  | Enhances user engagement and provides on-demand advice     |
| AD-004      | Use SQLite for data storage                            | [Date]  | Simplifies deployment and development                      |
| AD-005      | Implement local AI with Ollama and ChromaDB            | [Date]  | Ensures privacy and reduces dependency on external services |
| AD-006      | Implement vector store for financial context           | [Date]  | Enables AI to understand and process financial data        |
| AD-007      | Create a comprehensive user flow for financial planning| [Date]  | Provides a structured approach to financial planning       |
| AD-008      | Implement dynamic port allocation for ChromaDB         | [Date]  | Ensures reliable startup and prevents port conflicts        |
| AD-009      | Comprehensive .gitignore rules                         | [Date]  | Protects sensitive data and excludes generated files       |

## Technology Stack
- **Frontend**: React, TypeScript, Material-UI, React Query, Axios
- **Backend**: Node.js, Express, TypeORM, SQLite, OpenAI, ChromaDB
- **AI**: Ollama, ChromaDB, Vector Store
- **Authentication**: JWT, bcrypt
- **Development**: TypeScript, ESLint, Prettier, Jest

---