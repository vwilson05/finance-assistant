export interface Config {
    // Server configuration
    port: number;
    nodeEnv: string;

    // Database configuration
    database: {
        url: string;
    };

    // AI Service configuration
    ai: {
        // ChromaDB configuration
        chromaDbPath: string;
        
        // Ollama configuration
        ollamaBaseUrl: string;
        ollamaModel: string;
    };

    // Vector store configuration
    vectorStore: {
        url: string;
        collectionName: string;
    };

    // Logging configuration
    logging: {
        level: string;
    };
} 