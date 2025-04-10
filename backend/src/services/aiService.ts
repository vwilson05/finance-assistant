import { User } from '../models/User';
import { config } from '../config';
import { AIService as CoreAIService } from './ai/aiService';

class AIService {
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
          timestamp: new Date().toISOString()
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
}

// Export singleton instance
export const aiService = new AIService(); 