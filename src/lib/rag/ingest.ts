import { splitTextIntoChunks } from "@/lib/rag/chunking";
import { embedKnowledgeChunks } from "@/lib/rag/embeddings";
import { loadMarkdownKnowledge } from "@/lib/rag/knowledge-loader";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type IngestOptions = {
  dataDirectory: string;
  embeddingModel: string;
  chunkSize: number;
  chunkOverlap: number;
  replaceExisting: boolean;
};

type IngestSummary = {
  sourceFiles: number;
  chunksInserted: number;
  chunksDeleted: number;
};

/**
 * Ingests markdown knowledge files into Supabase vector table.
 *
 * @param options - Ingestion settings for data source and chunking.
 * @returns Summary counts for files, inserted chunks, and deleted rows.
 */
export async function ingestKnowledgeBase(
  options: IngestOptions,
): Promise<IngestSummary> {
  const documents = await loadMarkdownKnowledge(options.dataDirectory);
  const supabase = createServerSupabaseClient();

  const chunks = documents.flatMap((document) =>
    splitTextIntoChunks(
      document.content,
      options.chunkSize,
      options.chunkOverlap,
    ).map((content, chunkIndex) => ({
      source: document.source,
      content,
      metadata: {
        chunkIndex,
        dataDirectory: options.dataDirectory,
      },
    })),
  );

  if (chunks.length === 0) {
    return {
      sourceFiles: documents.length,
      chunksInserted: 0,
      chunksDeleted: 0,
    };
  }

  let chunksDeleted = 0;
  const sources = [...new Set(chunks.map((chunk) => chunk.source))];

  if (options.replaceExisting && sources.length > 0) {
    const { data, error } = await supabase
      .from("rag_chunks")
      .delete()
      .in("source", sources)
      .select("id");

    if (error) {
      throw new Error(`Failed deleting existing chunks: ${error.message}`);
    }

    chunksDeleted = data?.length ?? 0;
  }

  const embeddedChunks = await embedKnowledgeChunks(
    chunks,
    options.embeddingModel,
  );
  const rows = embeddedChunks.map((chunk) => ({
    source: chunk.source,
    content: chunk.content,
    embedding: chunk.embedding,
    metadata: chunk.metadata,
  }));

  const { error } = await supabase.from("rag_chunks").insert(rows);

  if (error) {
    throw new Error(`Failed inserting embedded chunks: ${error.message}`);
  }

  return {
    sourceFiles: documents.length,
    chunksInserted: rows.length,
    chunksDeleted,
  };
}
