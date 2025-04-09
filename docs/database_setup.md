# Database Setup and Migrations

This document outlines the database setup and migration process for the Personal Financial Assistant application.

## Database Configuration

The application uses PostgreSQL as its database. The connection details are configured through environment variables:

```
POSTGRES_SERVER=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password_here
POSTGRES_DB=financial_assistant
```

These can be set in a `.env` file in the backend directory.

## Database Initialization

To initialize the database for the first time:

1. Create a PostgreSQL database named `financial_assistant`
2. Set up the environment variables
3. Run the database initialization script:

```bash
cd backend
python -m app.db.init_db
```

## Database Migrations

The application uses Alembic for database migrations. The migration process is as follows:

### Creating a New Migration

When you make changes to the database models, you need to create a new migration:

```bash
cd backend
python scripts/create_initial_migration.py
```

This will generate a new migration file in the `alembic/versions` directory.

### Applying Migrations

To apply all pending migrations:

```bash
cd backend
python scripts/apply_migrations.py
```

### Migration Commands

Common Alembic commands:

- `alembic revision --autogenerate -m "Description"`: Create a new migration
- `alembic upgrade head`: Apply all pending migrations
- `alembic upgrade +1`: Apply the next migration
- `alembic downgrade -1`: Roll back the last migration
- `alembic downgrade base`: Roll back all migrations
- `alembic current`: Show the current migration version
- `alembic history`: Show migration history

## Database Models

The application uses the following database models:

- `User`: User authentication and profile
- `FinancialProfile`: User financial information
- `InvestmentAccount`: Investment accounts
- `InvestmentTransaction`: Investment transactions
- `InvestmentStrategy`: AI-generated investment strategies
- `ChatHistory`: User interactions with the AI assistant

For detailed information about each model, see [database_schema.md](database_schema.md).

## Development Workflow

1. Make changes to the models in `app/models/`
2. Create a new migration
3. Apply the migration
4. Test the changes

## Troubleshooting

### Common Issues

1. **Migration fails to apply**: Check that the database exists and the connection details are correct
2. **Alembic can't find models**: Ensure that the models are imported in `app/models/__init__.py`
3. **Database connection errors**: Verify that PostgreSQL is running and the credentials are correct

### Resetting the Database

To completely reset the database:

```bash
cd backend
python -m app.db.init_db drop_db
python -m app.db.init_db
python scripts/apply_migrations.py
```

**Warning**: This will delete all data in the database. 