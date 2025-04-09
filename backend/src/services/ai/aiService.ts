import { VectorStore } from './vectorStore';
import { OllamaService } from './ollamaService';

export class AIService {
    private static instance: AIService;
    private vectorStore: VectorStore;
    private ollamaService: OllamaService;

    private constructor() {
        this.vectorStore = VectorStore.getInstance();
        this.ollamaService = OllamaService.getInstance();
    }

    public static getInstance(): AIService {
        if (!AIService.instance) {
            AIService.instance = new AIService();
        }
        return AIService.instance;
    }

    public async initialize(): Promise<void> {
        await this.vectorStore.initialize();
    }

    public async addFinancialContext(
        text: string,
        metadata: Record<string, any>
    ): Promise<void> {
        await this.vectorStore.addDocument(text, metadata);
    }

    public async getFinancialAdvice(userQuery: string): Promise<string> {
        // Get relevant context from vector store
        const context = await this.vectorStore.query(userQuery);

        // Build the prompt with context
        const prompt = await this.ollamaService.buildFinancialPrompt(userQuery, context);

        // Generate response using Ollama
        return await this.ollamaService.generateResponse(prompt);
    }
} 