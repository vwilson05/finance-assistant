import { AppDataSource, setupDatabase } from '../data-source';
import { User } from '../models/User';
import { FinancialProfile } from '../models/FinancialProfile';
import { ChatMessage, MessageRole } from '../models/ChatMessage';

async function testDatabaseOperations() {
  try {
    await setupDatabase();
    console.log('Database connection established');

    // Create a test user
    const userRepository = AppDataSource.getRepository(User);
    const testUser = userRepository.create({
      email: 'test@example.com',
      password: 'hashed_password_here',
      firstName: 'Test',
      lastName: 'User',
      dateOfBirth: new Date('1990-01-01')
    });
    await userRepository.save(testUser);
    console.log('Test user created:', testUser);

    // Create a financial profile for the user
    const profileRepository = AppDataSource.getRepository(FinancialProfile);
    const testProfile = profileRepository.create({
      user: testUser,
      netWorth: 100000,
      monthlyIncome: 5000,
      monthlyExpenses: 3000,
      riskTolerance: 0.7,
      investmentHorizon: 10,
      currentSavings: 20000
    });
    await profileRepository.save(testProfile);
    console.log('Test financial profile created:', testProfile);

    // Create a chat message for the user
    const messageRepository = AppDataSource.getRepository(ChatMessage);
    const testMessage = messageRepository.create({
      user: testUser,
      content: 'Hello, this is a test message',
      role: MessageRole.USER,
      context: {
        relatedStrategy: 'investment',
        financialMetrics: [
          { metric: 'riskScore', value: 0.7 }
        ],
        userIntent: 'information',
        emotionalState: 'neutral'
      },
      metadata: {
        tokens: 10,
        processingTime: 100,
        model: 'gpt-4'
      },
      functionCall: {
        name: 'getFinancialAdvice',
        arguments: '{"riskLevel": "moderate"}',
        result: '{"advice": "Consider diversifying your portfolio"}'
      }
    });
    await messageRepository.save(testMessage);
    console.log('Test chat message created:', testMessage);

    // Query the data back to verify
    const savedUser = await userRepository.findOne({
      where: { email: 'test@example.com' },
      relations: ['financialProfile', 'messages']
    });
    console.log('Retrieved user with relations:', savedUser);

    // Clean up test data
    await messageRepository.delete({ user: { id: testUser.id } });
    await profileRepository.delete({ user: { id: testUser.id } });
    await userRepository.delete({ id: testUser.id });
    console.log('Test data cleaned up');

  } catch (error) {
    console.error('Error during database test:', error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Database connection closed');
    }
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testDatabaseOperations();
} 