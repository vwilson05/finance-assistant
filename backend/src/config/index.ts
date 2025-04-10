import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
    // Server configuration
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',

    // Database configuration
    database: {
        url: process.env.DATABASE_URL || 'sqlite:./financial_assistant.db'
    },

    // AI Service configuration
    ai: {
        // ChromaDB configuration
        chromaDbPath: process.env.CHROMA_DB_PATH || `http://localhost:${process.env.CHROMA_PORT || 8000}`,
        
        // Ollama configuration
        ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
        ollamaModel: process.env.OLLAMA_MODEL || 'tinyllama'
    },

    // Logging configuration
    logging: {
        level: process.env.LOG_LEVEL || 'info'
    }
}; 