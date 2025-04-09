import { ChromaClient, Collection } from 'chromadb';
import { config } from '../../config';

export class VectorStore {
    private client: ChromaClient;
    private collection: Collection | null = null;
    private static instance: VectorStore;

    private constructor() {
        this.client = new ChromaClient({
            path: config.chromaDbPath || 'http://localhost:8000'
        });
    }

    public static getInstance(): VectorStore {
        if (!VectorStore.instance) {
            VectorStore.instance = new VectorStore();
        }
        return VectorStore.instance;
    }

    public async initialize(): Promise<void> {
        try {
            // Create or get the collection
            this.collection = await this.client.getOrCreateCollection({
                name: 'financial_context',
                metadata: { 'description': 'Financial context and user data for AI personalization' }
            });
        } catch (error) {
            console.error('Failed to initialize vector store:', error);
            throw error;
        }
    }

    public async addDocument(text: string, metadata: Record<string, any>): Promise<void> {
        if (!this.collection) {
            throw new Error('Vector store not initialized');
        }

        try {
            await this.collection.add({
                ids: [Date.now().toString()],
                documents: [text],
                metadatas: [metadata]
            });
        } catch (error) {
            console.error('Failed to add document to vector store:', error);
            throw error;
        }
    }

    public async query(question: string, nResults: number = 5): Promise<Array<{ text: string; metadata: Record<string, any> }>> {
        if (!this.collection) {
            throw new Error('Vector store not initialized');
        }

        try {
            const results = await this.collection.query({
                queryTexts: [question],
                nResults: nResults
            });

            return results.documents[0].map((doc, index) => ({
                text: doc,
                metadata: results.metadatas[0][index]
            }));
        } catch (error) {
            console.error('Failed to query vector store:', error);
            throw error;
        }
    }
} 