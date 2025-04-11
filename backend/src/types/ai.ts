export interface AIResponse {
  content: string;
  usage?: {
    totalTokens: number;
    processingTime: number;
  };
  model?: string;
  functionResult?: any;
} 