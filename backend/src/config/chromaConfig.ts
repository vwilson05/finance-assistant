// Chroma Embedding Format Configuration

export const chromaEmbeddingFormat = {
  content: "Narrative summary or insight",
  metadata: {
    type: "plan | reflection | summary | event",
    goal_id: "optional",
    timestamp: "ISO format",
    source: "gpt | user"
  }
}; 