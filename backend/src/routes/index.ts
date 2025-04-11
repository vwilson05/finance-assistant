import { Express } from 'express';
import { userRoutes } from './userRoutes';
import { financialProfileRoutes } from './financialProfileRoutes';
import { strategyRoutes } from './strategyRoutes';
import { chatRoutes } from './chatRoutes';
import aiRoutes from './aiRoutes';
import functionRoutes from './functionRoutes';

export const setupRoutes = (app: Express) => {
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // API routes
  app.use('/api/users', userRoutes);
  app.use('/api/financial-profiles', financialProfileRoutes);
  app.use('/api/strategies', strategyRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/chat/function', functionRoutes);
}; 