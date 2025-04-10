import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface OllamaResponse {
    model: string;
    response: string;
    done: boolean;
}

interface FinancialProfileData {
    monthlyIncome: number;
    incomeFrequency: string;
    monthlyExpenses: number;
    totalSavings: number;
    totalDebt: number;
    investmentBalance: number;
    riskTolerance: number;
    investmentHorizon: number;
    currentSavings: number;
    goals: Record<string, string[]>;
    monthlyBudget: Record<string, number>;
}

export class OllamaService {
    private static instance: OllamaService;
    private baseUrl: string;
    private model: string;

    private constructor() {
        // Default values in case environment variables are not set
        const defaultBaseUrl = 'http://localhost:11434';
        const defaultModel = 'tinyllama';
        
        // Get values from environment variables with fallbacks
        this.baseUrl = process.env.OLLAMA_BASE_URL || defaultBaseUrl;
        this.model = process.env.OLLAMA_MODEL || defaultModel;
        
        console.log(`OllamaService initialized with baseUrl: ${this.baseUrl}, model: ${this.model}`);
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
                    stream: false,
                    system: "You are Sarah, a friendly financial advisor. Keep your responses short, natural, and conversational. For greetings, just say hello back. Only provide financial advice when specifically asked. Never refer to yourself in the third person."
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
        // Extract user profile and other context
        const userProfile = context.find(item => item.metadata.type === 'financial_profile');
        const userName = userProfile?.metadata?.userName || 'there';
        
        // Build a simple prompt
        return `${userName} says: "${userQuery}"

${userProfile ? `Financial profile: ${userProfile.text}` : ''}`;
    }
} 