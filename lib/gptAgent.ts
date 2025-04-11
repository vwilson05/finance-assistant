// Import necessary modules
import OpenAI from 'openai';

// Import Chroma client
import { getChromaEmbeddings } from '../utils/chromaClient';

// Initialize OpenAI API configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to call GPT-4 API with RAG
export async function callGPT4WithRAG(prompt: string, userProfile: any, goals: any) {
  try {
    // Retrieve embeddings from Chroma
    const embeddings = await getChromaEmbeddings(userProfile, goals);
    
    // Inject embeddings into the prompt
    const fullPrompt = `${prompt}\nEmbeddings: ${JSON.stringify(embeddings)}\nUser Profile: ${JSON.stringify(userProfile)}\nGoals: ${JSON.stringify(goals)}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: fullPrompt }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error calling GPT-4 API with RAG:', error);
    throw error;
  }
}

// Additional setup for function calling and RAG results will be added here. 