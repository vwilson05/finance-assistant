# Financial Assistant

A personal financial guidance application that provides tailored financial advice and strategy generation.

## Features

- User financial profiling
- Personalized financial strategy generation
- AI-powered financial advice chatbot
- Manual financial data entry and tracking
- Customizable financial goals and budgets

## Tech Stack

- Frontend: React with TypeScript
- Backend: Node.js with Express
- Database: SQLite
- AI Integration: OpenAI API

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vwilson05/finance-assistant.git
   cd finance-assistant
   ```

2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   ```bash
   # In the backend directory
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server (in a new terminal)
   cd frontend
   npm start
   ```

## Project Structure

```
financial-assistant/
├── docs/               # Project documentation
├── frontend/          # React frontend application
├── backend/           # Node.js backend server
├── database/          # Database migrations and seeds
└── tests/            # Test files
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 