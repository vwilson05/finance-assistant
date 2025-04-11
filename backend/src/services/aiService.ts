import { User } from '../models/User';
import { config } from '../config';
import { AIService as CoreAIService } from './ai/aiService';
import { FinancialProfile } from '../models/FinancialProfile';

interface AIMessage {
  role: string;
  content: string;
  context?: {
    financialProfile?: FinancialProfile;
    userIntent?: any;
    emotionalState?: any;
  };
}

interface AIResponse {
  content: string;
  usage?: {
    totalTokens: number;
    processingTime: number;
  };
  model?: string;
}

interface FunctionCallResult {
  message: AIResponse;
  functionResult: any;
}

export class AIService {
  private coreAIService: CoreAIService;

  constructor() {
    this.coreAIService = CoreAIService.getInstance();
    this.initialize();
  }

  private async initialize() {
    try {
      await this.coreAIService.initialize();
      console.log('AI service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AI service:', error);
    }
  }

  /**
   * Generate a response from the AI model
   */
  async generateResponse(userMessage: string, user: User): Promise<string> {
    try {
      // Add user's financial profile to context if available
      if (user.financialProfile) {
        const profileText = JSON.stringify(user.financialProfile);
        await this.coreAIService.addFinancialContext(profileText, {
          type: 'financial_profile',
          userId: user.id,
          timestamp: new Date().toISOString(),
          importance: 'high'
        });
      }

      // Get financial advice using the core AI service
      return await this.coreAIService.getFinancialAdvice(userMessage);
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw error;
    }
  }

  /**
   * Generate financial advice based on user query and profile
   */
  async generateFinancialAdvice(query: string, user: User): Promise<string> {
    try {
      // Add user's financial profile to context if available
      if (user.financialProfile) {
        const profileText = JSON.stringify(user.financialProfile);
        await this.coreAIService.addFinancialContext(profileText, {
          type: 'financial_profile',
          userId: user.id,
          timestamp: new Date().toISOString()
        });
      }

      // Get financial advice using the core AI service
      return await this.coreAIService.getFinancialAdvice(query);
    } catch (error) {
      console.error('Error generating financial advice:', error);
      throw error;
    }
  }

  /**
   * Add financial context to the AI service
   */
  async addFinancialContext(text: string, metadata: Record<string, any>): Promise<void> {
    try {
      await this.coreAIService.addFinancialContext(text, metadata);
    } catch (error) {
      console.error('Error adding financial context:', error);
      throw error;
    }
  }

  async detectUserIntent(content: string): Promise<any> {
    // TODO: Implement intent detection logic
    return { type: 'general', confidence: 0.8 };
  }

  async detectEmotionalState(content: string): Promise<any> {
    // TODO: Implement emotional state detection logic
    return { emotion: 'neutral', intensity: 0.5 };
  }

  async addMessage(message: AIMessage): Promise<void> {
    // TODO: Implement message context management
  }

  async generateResponseWithFunctionCall(functionCall: any): Promise<FunctionCallResult> {
    // TODO: Implement function call handling
    return {
      message: {
        content: 'Function call processed.',
        usage: {
          totalTokens: 0,
          processingTime: 0
        },
        model: 'gpt-4'
      },
      functionResult: {}
    };
  }
}

// Export singleton instance
export const aiService = new AIService(); 