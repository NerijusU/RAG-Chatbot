import { embedQueryText } from "@/lib/rag/embeddings";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type RetrievalOptions = {
  embeddingModel: string;
  matchCount: number;
};

export type RetrievedChunk = {
  source: string;
  content: string;
  metadata: Record<string, unknown> | null;
  similarity: number;
};

/**
 * Retrieves the most relevant chunks using Supabase pgvector similarity search.
 *
 * @param query - User query to search against embeddings.
 * @param options - Retrieval options including model and top-k count.
 * @returns Retrieved chunks ordered by descending similarity.
 */
export async function retrieveRelevantChunks(
  query: string,
  options: RetrievalOptions,
): Promise<RetrievedChunk[]> {
  const queryEmbedding = await embedQueryText(query, options.embeddingModel);
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.rpc("match_rag_chunks", {
    query_embedding: queryEmbedding,
    match_count: options.matchCount,
  });

  if (error) {
    throw new Error(
      `Retrieval failed. Ensure SQL function match_rag_chunks exists: ${error.message}`,
    );
  }

  const rows = (data ?? []) as Array<{
    source: string;
    content: string;
    metadata: Record<string, unknown> | null;
    similarity: number;
  }>;

  return rows;
}
