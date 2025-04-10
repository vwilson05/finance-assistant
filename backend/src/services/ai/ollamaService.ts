import axios from 'axios';
import { config } from '../../config';

interface OllamaResponse {
    model: string;
    response: string;
    done: boolean;
}

interface FinancialProfileData {
    income: {
        salary: number;
        other: number;
    };
    debt?: {
        creditCards: number;
        loans: number;
        mortgage: number;
        other: number;
    };
    investments?: {
        stocks: number;
        bonds: number;
        realEstate: number;
        other: number;
    };
    currentSavings?: number;
}

export class OllamaService {
    private static instance: OllamaService;
    private baseUrl: string;
    private model: string;

    private constructor() {
        // Default values in case config is not fully loaded
        const defaultBaseUrl = 'http://localhost:11434';
        const defaultModel = 'tinyllama';
        
        // Safely access config properties with fallbacks
        this.baseUrl = config.vectorStore?.url || defaultBaseUrl;
        this.model = process.env.OLLAMA_MODEL || defaultModel;
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
        // Extract user profile and other context
        const userProfile = context.find(item => item.metadata.type === 'financial_profile');
        const financialMetrics = context
            .filter(item => item.metadata.type === 'financial_metrics')
            .map(item => item.text)
            .join('\n');
        const marketConditions = context
            .filter(item => item.metadata.type === 'market_conditions')
            .map(item => item.text)
            .join('\n');
        
        // Extract conversation history for continuity
        const conversationHistory = context
            .filter(item => item.metadata.type === 'conversation_context')
            .sort((a, b) => {
                const timeA = new Date(a.metadata.timestamp || 0).getTime();
                const timeB = new Date(b.metadata.timestamp || 0).getTime();
                return timeA - timeB;
            })
            .map(item => item.text)
            .join('\n\n');
        
        // Extract user's name if available
        const userName = userProfile?.metadata?.userName || 'there';
        
        // Determine the user's financial situation
        let financialSituation = 'standard';
        if (userProfile) {
            try {
                const profile = JSON.parse(userProfile.text) as FinancialProfileData;
                
                // Calculate total debt
                const totalDebt = profile.debt ? 
                    Object.values(profile.debt).reduce((sum, value) => sum + (typeof value === 'number' ? value : 0), 0) : 0;
                
                // Calculate total investments
                const totalInvestments = profile.investments ? 
                    Object.values(profile.investments).reduce((sum, value) => sum + (typeof value === 'number' ? value : 0), 0) : 0;
                
                // Determine financial situation
                if (totalDebt > (profile.income.salary * 0.5)) {
                    financialSituation = 'high_debt';
                } else if (totalInvestments > (profile.income.salary * 2)) {
                    financialSituation = 'investor';
                } else if (profile.currentSavings !== undefined && profile.currentSavings < (profile.income.salary * 0.1)) {
                    financialSituation = 'low_savings';
                }
            } catch (error) {
                console.error('Error parsing financial profile:', error);
            }
        }

        // Build a personalized prompt
        return `You are a dedicated, expert financial advisor with years of experience helping people achieve their financial goals. You have a warm, empathetic personality and genuinely care about your client's financial well-being. You're speaking directly with ${userName}, who you've been working with on their financial journey.

User Profile:
${userProfile ? userProfile.text : 'No profile available'}

Current Financial Metrics:
${financialMetrics || 'No metrics available'}

Market Conditions:
${marketConditions || 'No market data available'}

Previous Conversation Context:
${conversationHistory || 'No previous context available'}

User Query: ${userQuery}

Based on the user's financial situation (${financialSituation}), please provide a personalized response that:
1. Addresses the user by name and acknowledges their specific financial situation
2. References previous conversations or advice when relevant
3. Considers their risk tolerance, investment horizon, and financial goals
4. Takes into account current market conditions and economic factors
5. Provides actionable, specific advice tailored to their unique circumstances
6. Uses a warm, conversational tone as if you're having a one-on-one meeting
7. Shows empathy and understanding of their financial challenges
8. Explains your reasoning in clear, non-technical terms
9. Offers encouragement and positive reinforcement
10. Suggests follow-up questions or next steps to continue the conversation

Remember, you're not just providing generic financial advice - you're acting as a dedicated personal financial advisor who knows this client well and is invested in their financial success. Your response should feel like a continuation of an ongoing relationship, not a one-time interaction.

Response:`;
    }
} 