import { ChromaClient } from 'chromadb';
import { config } from '../src/config';
import { DefaultEmbeddingFunction } from 'chromadb';

const financialKnowledge = [
    {
        id: 'debt-payoff-1',
        text: 'The debt snowball method involves paying off debts from smallest to largest, gaining momentum as each balance is paid off.',
        metadata: { category: 'debt', topic: 'debt-payoff-strategies' }
    },
    {
        id: 'debt-payoff-2',
        text: 'The debt avalanche method focuses on paying off debts with the highest interest rates first, potentially saving more money in interest payments.',
        metadata: { category: 'debt', topic: 'debt-payoff-strategies' }
    },
    {
        id: 'budgeting-1',
        text: 'The 50/30/20 rule suggests allocating 50% of income to needs, 30% to wants, and 20% to savings and debt repayment.',
        metadata: { category: 'budgeting', topic: 'budgeting-strategies' }
    },
    {
        id: 'investing-1',
        text: 'Diversification is a key investment strategy that spreads risk across different types of investments.',
        metadata: { category: 'investing', topic: 'investment-basics' }
    },
    {
        id: 'saving-1',
        text: 'An emergency fund should cover 3-6 months of living expenses to handle unexpected financial challenges.',
        metadata: { category: 'saving', topic: 'emergency-funds' }
    }
];

async function initializeVectorStore() {
    try {
        const client = new ChromaClient({
            path: config.vectorStore.url
        });

        const embeddingFunction = new DefaultEmbeddingFunction();

        // Try to get existing collection or create a new one
        let collection;
        try {
            collection = await client.getCollection({
                name: 'financial_knowledge',
                embeddingFunction
            });
            console.log('Using existing collection');
        } catch (error) {
            collection = await client.createCollection({
                name: 'financial_knowledge',
                metadata: { description: 'Financial advice and knowledge base' },
                embeddingFunction
            });
            console.log('Created new collection');
        }

        // Add documents to the collection
        await collection.add({
            ids: financialKnowledge.map(item => item.id),
            documents: financialKnowledge.map(item => item.text),
            metadatas: financialKnowledge.map(item => item.metadata)
        });

        console.log('Vector store initialized successfully!');
    } catch (error) {
        console.error('Failed to initialize vector store:', error);
        process.exit(1);
    }
}

initializeVectorStore(); 