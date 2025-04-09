import { Request, Response } from 'express';
import { AIService } from '../services/ai/aiService';

export class AIController {
    private static instance: AIController;
    private aiService: AIService;

    private constructor() {
        this.aiService = AIService.getInstance();
    }

    public static getInstance(): AIController {
        if (!AIController.instance) {
            AIController.instance = new AIController();
        }
        return AIController.instance;
    }

    public async initialize(req: Request, res: Response): Promise<void> {
        try {
            await this.aiService.initialize();
            res.status(200).json({ message: 'AI service initialized successfully' });
        } catch (error) {
            console.error('Failed to initialize AI service:', error);
            res.status(500).json({ error: 'Failed to initialize AI service' });
        }
    }

    public async addContext(req: Request, res: Response): Promise<void> {
        try {
            const { text, metadata } = req.body;
            
            if (!text) {
                res.status(400).json({ error: 'Text is required' });
                return;
            }

            await this.aiService.addFinancialContext(text, metadata || {});
            res.status(200).json({ message: 'Context added successfully' });
        } catch (error) {
            console.error('Failed to add context:', error);
            res.status(500).json({ error: 'Failed to add context' });
        }
    }

    public async getAdvice(req: Request, res: Response): Promise<void> {
        try {
            const { query } = req.body;
            
            if (!query) {
                res.status(400).json({ error: 'Query is required' });
                return;
            }

            const advice = await this.aiService.getFinancialAdvice(query);
            res.status(200).json({ advice });
        } catch (error) {
            console.error('Failed to get financial advice:', error);
            res.status(500).json({ error: 'Failed to get financial advice' });
        }
    }
} 