import axios from 'axios';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Default user ID for development
const DEFAULT_USER_ID = 'dev-user-1';

// Types
export interface FinancialProfile {
  id?: string;
  userId: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  totalSavings: number;
  totalDebt: number;
  investmentBalance: number;
  riskTolerance: 'Conservative' | 'Moderate' | 'Aggressive';
  financialGoals: FinancialGoal[];
  monthlyBudget: Record<string, number>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FinancialGoal {
  id?: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  completed?: boolean;
}

export interface FinancialPlan {
  id?: string;
  userId: string;
  name: string;
  description: string;
  recommendations: Recommendation[];
  milestones: Milestone[];
  targetAmount: number;
  targetDate: string;
  progress: {
    currentAmount: number;
    lastUpdated: string;
    notes: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Recommendation {
  id?: string;
  action: string;
  priority: number;
  timeframe: string;
  expectedImpact: 'Low' | 'Medium' | 'High';
}

export interface Milestone {
  id?: string;
  description: string;
  targetDate: string;
  completed: boolean;
}

export interface AIInsights {
  understanding: string;
  suggestions: string[];
  marketInsights: string[];
}

class FinancialService {
  /**
   * Get financial profile for the current user
   */
  async getFinancialProfile(): Promise<FinancialProfile> {
    try {
      const response = await api.get(`/financial-profiles/${DEFAULT_USER_ID}`);
      return response.data.data.profile;
    } catch (error) {
      console.error('Failed to fetch financial profile:', error);
      
      // Provide more specific error messages
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('Financial profile not found. Please try again later.');
        } else if (error.response?.status === 500) {
          throw new Error('Server error. Please try again later.');
        } else if (!error.response) {
          throw new Error('Network error. Please check your connection and try again.');
        }
      }
      
      throw new Error('Failed to load financial data. Please try again later.');
    }
  }

  /**
   * Update financial profile for the current user
   */
  async updateFinancialProfile(profile: Partial<FinancialProfile>): Promise<FinancialProfile> {
    try {
      const response = await api.put(`/financial/profile/${DEFAULT_USER_ID}`, profile);
      return response.data.profile;
    } catch (error) {
      console.error('Failed to update financial profile:', error);
      throw error;
    }
  }

  /**
   * Get financial plan for the current user
   */
  async getFinancialPlan(): Promise<FinancialPlan> {
    try {
      const response = await api.get(`/financial/plan/${DEFAULT_USER_ID}`);
      return response.data.plan;
    } catch (error) {
      console.error('Failed to fetch financial plan:', error);
      throw error;
    }
  }

  /**
   * Generate a new financial plan
   */
  async generateFinancialPlan(): Promise<FinancialPlan> {
    try {
      const response = await api.post(`/financial/plan/${DEFAULT_USER_ID}/generate`);
      return response.data.plan;
    } catch (error) {
      console.error('Failed to generate financial plan:', error);
      throw error;
    }
  }

  /**
   * Get AI insights for the current user
   */
  async getAIInsights(): Promise<AIInsights> {
    try {
      const response = await api.get(`/financial/insights/${DEFAULT_USER_ID}`);
      return response.data.insights;
    } catch (error) {
      console.error('Failed to fetch AI insights:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const financialService = new FinancialService(); 