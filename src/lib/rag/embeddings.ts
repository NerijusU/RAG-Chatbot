import OpenAI from "openai";

import { getRequiredEnv } from "@/lib/env";
import type { EmbeddedChunk, KnowledgeChunk } from "@/lib/rag/types";

/**
 * Creates an OpenAI client for embeddings operations.
 *
 * @param none - This function does not accept any parameters.
 * @returns Configured OpenAI client instance.
 */
function createOpenAiClient(): OpenAI {
  return new OpenAI({
    apiKey: getRequiredEnv("OPENAI_API_KEY"),
  });
}

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

  const openAiClient = createOpenAiClient();

  const response = await openAiClient.embeddings.create({
    model,
    input: chunks.map((chunk) => chunk.content),
  });

  return chunks.map((chunk, index) => {
    const embedding = response.data[index]?.embedding;
    if (!embedding || embedding.length === 0) {
      throw new Error(
        `Embedding API returned no vector for chunk index ${index}.`,
      );
    }

    return {
      ...chunk,
      embedding,
    };
  });
}

/**
 * Generates one embedding vector for a user query string.
 *
 * @param query - Input query text to embed.
 * @param model - Embeddings model identifier.
 * @returns Embedding vector for similarity search.
 */
export async function embedQueryText(
  query: string,
  model: string,
): Promise<number[]> {
  const openAiClient = createOpenAiClient();
  const response = await openAiClient.embeddings.create({
    model,
    input: query,
  });

  const embedding = response.data[0]?.embedding;
  if (!embedding || embedding.length === 0) {
    throw new Error("Embedding API returned no vector for the query.");
  }

  return embedding;
}
