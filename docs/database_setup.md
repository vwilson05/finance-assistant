# Database Setup and Migrations

This document outlines the database setup and migration process for the Personal Financial Assistant application.

## Database Configuration

The application uses two types of databases:

### SQLite Database
The main application database uses SQLite, managed through TypeORM. The connection details are configured through environment variables:

```
DB_TYPE=sqlite
DB_NAME=financial_assistant.db
DB_PATH=./financial_assistant.db
```

### ChromaDB Configuration
The vector store database (ChromaDB) uses dynamic port allocation to prevent conflicts:

```
CHROMA_PORT=8000  # Default port, will try 8001-8004 if 8000 is unavailable
CHROMA_DB_PATH=http://localhost:${CHROMA_PORT}
```

The application will automatically:
1. Try to start ChromaDB on port 8000
2. If port 8000 is unavailable, try ports 8001-8004
3. Set the successful port in the environment for other services to use

These can be set in a `.env` file in the backend directory.

## Database Initialization

To initialize the database for the first time:

1. Set up the environment variables in the backend directory
2. Run the application, which will automatically create the database and tables

```bash
cd backend
npm run dev
```

## Database Migrations

The application uses TypeORM for database migrations. The migration process is as follows:

### Creating a New Migration

When you make changes to the database models, you need to create a new migration:

```bash
cd backend
npm run typeorm migration:create -- -n MigrationName
```

This will generate a new migration file in the `src/migrations` directory.

### Running Migrations

To run all pending migrations, use the provided script:

```bash
cd backend
npm run migrate
```

This script will:
1. Initialize the database connection
2. Run all pending migrations
3. Log the results of the migration process
4. Close the database connection

### Migration Commands

Common TypeORM migration commands:

- `npm run typeorm migration:create -- -n MigrationName`: Create a new migration
- `npm run migrate`: Run all pending migrations
- `npm run typeorm migration:revert`: Revert the last migration
- `npm run typeorm migration:show`: Show all migrations and their status

## Database Models

The application uses the following database models:

- `User`: User authentication and profile
- `FinancialProfile`: User financial information
- `Strategy`: AI-generated investment strategies
- `ChatMessage`: User interactions with the AI assistant

For detailed information about each model, see [database_schema.md](database_schema.md).

## Development Workflow

1. Make changes to the models in `src/models/`
2. Create a new migration
3. Apply the migration using `npm run migrate`
4. Test the changes

## Troubleshooting

### Common Issues

1. **Migration fails to apply**: Check that the database exists and the connection details are correct
2. **TypeORM can't find models**: Ensure that the models are properly exported and imported
3. **Database connection errors**: Verify that SQLite is properly configured
4. **Column not found errors**: Make sure you've run all migrations after changing the model

### Resetting the Database

To completely reset the database:

```bash
cd backend
rm financial_assistant.db
npm run dev
```

This will delete the database file and recreate it with the latest schema. 