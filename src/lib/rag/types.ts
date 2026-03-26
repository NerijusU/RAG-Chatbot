export type KnowledgeChunk = {
  source: string;
  content: string;
  metadata: Record<string, unknown>;
};

export type EmbeddedChunk = KnowledgeChunk & {
  embedding: number[];
};
