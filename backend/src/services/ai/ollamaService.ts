import axios from 'axios';
import { config } from '../../config';

interface OllamaResponse {
    model: string;
    response: string;
    done: boolean;
}

export class OllamaService {
    private static instance: OllamaService;
    private baseUrl: string;
    private model: string;

    private constructor() {
        // Default values in case config is not fully loaded
        const defaultBaseUrl = 'http://localhost:11434';
        const defaultModel = 'smollm2:135m';
        
        // Safely access config properties with fallbacks
        this.baseUrl = config?.ai?.ollamaBaseUrl || defaultBaseUrl;
        this.model = config?.ai?.ollamaModel || defaultModel;
    }

    public static getInstance(): OllamaService {
        if (!OllamaService.instance) {
            OllamaService.instance = new OllamaService();
        }
        return OllamaService.instance;
    }

    public async generateResponse(prompt: string): Promise<string> {
        try {
            const response = await axios.post<OllamaResponse>(
                `${this.baseUrl}/api/generate`,
                {
                    model: this.model,
                    prompt: prompt,
                    stream: false
                }
            );

            return response.data.response;
        } catch (error) {
            console.error('Failed to generate response from Ollama:', error);
            throw error;
        }
    }

    public async buildFinancialPrompt(
        userQuery: string,
        context: Array<{ text: string; metadata: Record<string, any> }>
    ): Promise<string> {
        const contextString = context
            .map(item => `${item.text} (${JSON.stringify(item.metadata)})`)
            .join('\n\n');

        return `You are my AI financial advisor. Use the following context to provide personalized financial advice:

Context:
${contextString}

User Query: ${userQuery}

Please provide a clear, concise response based on the user's financial context and current market conditions.`;
    }
} 