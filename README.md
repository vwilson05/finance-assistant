# Financial Assistant

An AI-powered personal finance tool designed to replace the need for high-priced financial advisors. It helps users build tailored investment strategies and adapt plans dynamically based on market conditions through interactive, data-driven insights.

## Features

- **Personalized Financial Profiling:** Establish a comprehensive financial baseline.
- **Tailored Investment Strategies:** Design customized, actionable financial plans.
- **Interactive Guidance:** Provide on-demand, AI-driven advice through a conversational chatbot.
- **Dynamic Adaptability:** Adjust plans based on market trends and macroeconomic factors.

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

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Docker (for running ChromaDB)
- Ollama (for running the AI model locally)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/financial-assistant.git
cd financial-assistant
```

2. Install dependencies:
```bash
npm run install:all
```

3. Start the required services (Ollama and ChromaDB):
```bash
./start-services.sh
```

4. Start the application:
```bash
./start.sh
```

This will start both the frontend and backend servers.

## Development

### Starting Required Services

Before starting the application, make sure to start the required services:

```bash
./start-services.sh
```

This script will:
- Start ChromaDB using Docker
- Start Ollama server
- Pull the Mistral model if not already available

### Frontend Development

```bash
cd frontend
npm run dev
```

The frontend will be available at http://localhost:3000.

### Backend Development

```bash
cd backend
npm run dev
```

The backend API will be available at http://localhost:5000.

## Documentation

Comprehensive documentation is available in the `docs` directory:

- [Project Overview](docs/project_overview.md)
- [Architecture](docs/architecture.md)
- [Features](docs/features.md)
- [Database Schema](docs/database_schema.md)
- [Database Setup](docs/database_setup.md)
- [UI/UX Guidelines](docs/ui_ux.md)
- [Milestones](docs/milestones.md)
- [Issues](docs/issues.md)

## License

This project is licensed under the MIT License - see the LICENSE file for details. 