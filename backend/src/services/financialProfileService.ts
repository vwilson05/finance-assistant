import { FinancialProfile } from '../models/FinancialProfile';
import { AppDataSource } from '../data-source';

export class FinancialProfileService {
  async getFinancialProfile(userId: string): Promise<FinancialProfile | null> {
    const financialProfileRepository = AppDataSource.getRepository(FinancialProfile);
    return await financialProfileRepository.findOne({
      where: { user: { id: userId } }
    });
  }
} 