import axios from 'axios';

// Define message type
export type MessageRole = 'user' | 'assistant' | 'system';
export interface ChatMessage {
  id?: string;
  role: MessageRole;
  content: string;
  createdAt?: Date;
  context?: {
    relatedStrategy?: string;
    financialMetrics?: {
      metric: string;
      value: number;
    }[];
    userIntent?: string;
  };
  metadata?: {
    tokens: number;
    processingTime: number;
    model: string;
  };
  functionCall?: {
    name: string;
    arguments: string;
    result?: any;
  };
}

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

class ChatService {
  /**
   * Get chat history for the current user
   */
  async getChatHistory(): Promise<ChatMessage[]> {
    try {
      const response = await api.get(`/chat/history/${DEFAULT_USER_ID}`);
      return response.data.messages;
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
      throw error;
    }
  }

  /**
   * Get a specific conversation thread
   */
  async getThread(threadId: string): Promise<ChatMessage[]> {
    try {
      const response = await api.get(`/chat/thread/${threadId}`);
      return response.data.messages;
    } catch (error) {
      console.error('Failed to fetch thread:', error);
      throw error;
    }
  }

  /**
   * Send a message to the AI assistant with function calling support
   */
  async sendMessage(content: string): Promise<ChatMessage> {
    try {
      const response = await api.post('/chat/message', { 
        content,
        role: 'user' as MessageRole,
        enableFunctionCalling: true
      });
      return response.data.message;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  /**
   * Get AI-generated financial advice
   */
  async getFinancialAdvice(query: string): Promise<string> {
    try {
      const response = await api.post(`/chat/advice/${DEFAULT_USER_ID}`, { query });
      return response.data.advice;
    } catch (error) {
      console.error('Failed to get financial advice:', error);
      throw error;
    }
  }

  /**
   * Clear chat history for the current user
   */
  async clearHistory(): Promise<void> {
    try {
      await api.delete(`/chat/history/${DEFAULT_USER_ID}`);
    } catch (error) {
      console.error('Failed to clear chat history:', error);
      throw error;
    }
  }

  /**
   * Execute a function call and get the result
   */
  async executeFunctionCall(functionCall: { name: string, arguments: string }): Promise<any> {
    try {
      const response = await api.post('/chat/function', functionCall);
      return response.data.result;
    } catch (error) {
      console.error('Failed to execute function call:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const chatService = new ChatService(); 