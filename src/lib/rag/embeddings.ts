import OpenAI from "openai";

import { getRequiredEnv } from "@/lib/env";
import type { EmbeddedChunk, KnowledgeChunk } from "@/lib/rag/types";

/**
 * Generates embeddings for knowledge chunks using OpenAI embeddings API.
 *
 * @param chunks - Knowledge chunks that need vector embeddings.
 * @param model - Embeddings model identifier.
 * @returns Embedded chunks in the same order as input.
 */
export async function embedKnowledgeChunks(
  chunks: KnowledgeChunk[],
  model: string,
): Promise<EmbeddedChunk[]> {
  if (chunks.length === 0) {
    return [];
  }

  const openAiClient = new OpenAI({
    apiKey: getRequiredEnv("OPENAI_API_KEY"),
  });

  const response = await openAiClient.embeddings.create({
    model,
    input: chunks.map((chunk) => chunk.content),
  });

  return chunks.map((chunk, index) => ({
    ...chunk,
    embedding: response.data[index]?.embedding ?? [],
  }));
}
