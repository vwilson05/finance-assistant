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
        // Add timestamp if not provided
        if (!metadata.timestamp) {
            metadata.timestamp = new Date().toISOString();
        }

        // Add document to vector store
        await this.vectorStore.addDocument(text, metadata);

        // If this is a financial profile update, also add it as a conversation context
        if (metadata.type === 'financial_profile') {
            await this.vectorStore.addDocument(
                `User's financial profile has been updated: ${text}`,
                {
                    ...metadata,
                    type: 'conversation_context',
                    importance: 'high'
                }
            );
            
            // Add user preferences based on profile
            try {
                const profile = JSON.parse(text);
                if (profile.riskTolerance !== undefined) {
                    await this.vectorStore.addDocument(
                        `User's risk tolerance is ${profile.riskTolerance}. This affects investment recommendations.`,
                        {
                            ...metadata,
                            type: 'user_preference',
                            category: 'risk_tolerance',
                            importance: 'high'
                        }
                    );
                }
                
                if (profile.investmentHorizon !== undefined) {
                    await this.vectorStore.addDocument(
                        `User's investment horizon is ${profile.investmentHorizon} years. This affects long-term planning.`,
                        {
                            ...metadata,
                            type: 'user_preference',
                            category: 'investment_horizon',
                            importance: 'high'
                        }
                    );
                }
                
                if (profile.goals) {
                    const goalsText = Object.entries(profile.goals)
                        .map(([term, goals]) => `${term} goals: ${(goals as string[]).join(', ')}`)
                        .join('\n');
                    
                    await this.vectorStore.addDocument(
                        `User's financial goals:\n${goalsText}`,
                        {
                            ...metadata,
                            type: 'user_preference',
                            category: 'financial_goals',
                            importance: 'high'
                        }
                    );
                }
            } catch (error) {
                console.error('Error processing financial profile for preferences:', error);
            }
        }
        
        // If this is a user message, add it as conversation context
        if (metadata.type === 'user_message') {
            await this.vectorStore.addDocument(
                `User said: ${text}`,
                {
                    ...metadata,
                    type: 'conversation_context',
                    importance: 'medium'
                }
            );
            
            // Track user preferences and goals mentioned in the message
            await this.trackUserPreferencesFromMessage(text, metadata);
        }
        
        // If this is an AI response, add it as conversation context
        if (metadata.type === 'ai_response') {
            await this.vectorStore.addDocument(
                `I advised: ${text}`,
                {
                    ...metadata,
                    type: 'conversation_context',
                    importance: 'medium'
                }
            );
        }
    }

    /**
     * Track user preferences and goals mentioned in messages
     */
    private async trackUserPreferencesFromMessage(
        message: string,
        metadata: Record<string, any>
    ): Promise<void> {
        const messageLower = message.toLowerCase();
        
        // Track risk tolerance preferences
        if (messageLower.includes('risk') || messageLower.includes('conservative') || messageLower.includes('aggressive')) {
            let riskPreference = 'moderate';
            if (messageLower.includes('conservative') || messageLower.includes('low risk') || messageLower.includes('safe')) {
                riskPreference = 'conservative';
            } else if (messageLower.includes('aggressive') || messageLower.includes('high risk') || messageLower.includes('risky')) {
                riskPreference = 'aggressive';
            }
            
            await this.vectorStore.addDocument(
                `User mentioned a ${riskPreference} risk tolerance in conversation.`,
                {
                    ...metadata,
                    type: 'user_preference',
                    category: 'risk_tolerance',
                    importance: 'medium',
                    source: 'conversation'
                }
            );
        }
        
        // Track investment preferences
        if (messageLower.includes('invest') || messageLower.includes('stock') || messageLower.includes('fund')) {
            let investmentType = 'general';
            if (messageLower.includes('stock') || messageLower.includes('equity')) {
                investmentType = 'stocks';
            } else if (messageLower.includes('bond') || messageLower.includes('fixed income')) {
                investmentType = 'bonds';
            } else if (messageLower.includes('real estate') || messageLower.includes('property')) {
                investmentType = 'real estate';
            } else if (messageLower.includes('crypto') || messageLower.includes('bitcoin')) {
                investmentType = 'cryptocurrency';
            }
            
            await this.vectorStore.addDocument(
                `User expressed interest in ${investmentType} investments.`,
                {
                    ...metadata,
                    type: 'user_preference',
                    category: 'investment_type',
                    importance: 'medium',
                    source: 'conversation'
                }
            );
        }
        
        // Track financial goals
        if (messageLower.includes('goal') || messageLower.includes('target') || messageLower.includes('aim') || 
            messageLower.includes('want to') || messageLower.includes('would like to')) {
            
            // Extract potential goals from the message
            const goalPatterns = [
                /(?:goal|target|aim|want to|would like to)\s+(?:is|to|of)?\s+([^.,!?]+)/i,
                /(?:save|invest|earn|make)\s+(\d+[kKmMbB]?\s*(?:dollars|bucks|money|USD)?)/i,
                /(?:retire|buy|purchase|own)\s+([^.,!?]+)/i
            ];
            
            for (const pattern of goalPatterns) {
                const match = message.match(pattern);
                if (match && match[1]) {
                    const goal = match[1].trim();
                    await this.vectorStore.addDocument(
                        `User mentioned a financial goal: ${goal}`,
                        {
                            ...metadata,
                            type: 'user_preference',
                            category: 'financial_goals',
                            importance: 'medium',
                            source: 'conversation'
                        }
                    );
                }
            }
        }
        
        // Track emotional state related to finances
        if (messageLower.includes('worried') || messageLower.includes('concerned') || messageLower.includes('anxious') || 
            messageLower.includes('stress') || messageLower.includes('frustrated') || messageLower.includes('angry')) {
            
            let emotionalState = 'negative';
            let financialConcern = 'general';
            
            if (messageLower.includes('debt') || messageLower.includes('loan') || messageLower.includes('credit')) {
                financialConcern = 'debt';
            } else if (messageLower.includes('retire') || messageLower.includes('future') || messageLower.includes('old age')) {
                financialConcern = 'retirement';
            } else if (messageLower.includes('job') || messageLower.includes('work') || messageLower.includes('income')) {
                financialConcern = 'income';
            } else if (messageLower.includes('market') || messageLower.includes('stock') || messageLower.includes('invest')) {
                financialConcern = 'investments';
            }
            
            await this.vectorStore.addDocument(
                `User expressed ${emotionalState} emotions about their ${financialConcern} financial situation.`,
                {
                    ...metadata,
                    type: 'user_preference',
                    category: 'emotional_state',
                    importance: 'medium',
                    source: 'conversation'
                }
            );
        }
    }

    public async getFinancialAdvice(userQuery: string): Promise<string> {
        // Get relevant context from vector store with increased results for better context
        const context = await this.vectorStore.query(userQuery, 15);

        // Sort context by importance and recency
        const sortedContext = context.sort((a, b) => {
            const importanceA = a.metadata.importance === 'high' ? 1 : 0;
            const importanceB = b.metadata.importance === 'high' ? 1 : 0;
            if (importanceA !== importanceB) return importanceB - importanceA;
            
            const timeA = new Date(a.metadata.timestamp || 0).getTime();
            const timeB = new Date(b.metadata.timestamp || 0).getTime();
            return timeB - timeA;
        });

        // Build the prompt with enhanced context
        const prompt = await this.ollamaService.buildFinancialPrompt(userQuery, sortedContext);

        // Generate response using Ollama
        return await this.ollamaService.generateResponse(prompt);
    }
} 