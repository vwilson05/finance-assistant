import { Request } from 'express';
import { User } from '../models/User';
import { AppDataSource } from '../data-source';

export class AuthService {
  async authenticateUser(req: Request): Promise<User | null> {
    const userId = req.user?.id;
    if (!userId) {
      return null;
    }

    const userRepository = AppDataSource.getRepository(User);
    return await userRepository.findOne({ 
      where: { id: userId },
      relations: ['financialProfile']
    });
  }
} 