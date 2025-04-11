// Weekly Orchestrator Script

import { callGPT4WithRAG } from '../lib/gptAgent';

async function generateWeeklySummary(userProfile: any, goals: any) {
  const prompt = 'Generate a weekly summary of financial activities and goals.';
  const summary = await callGPT4WithRAG(prompt, userProfile, goals);
  console.log('Weekly Summary:', summary);
}

// Example usage
generateWeeklySummary({}, {}); 