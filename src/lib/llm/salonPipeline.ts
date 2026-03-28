import { RunnableLambda, RunnableSequence } from "@langchain/core/runnables";

import { formatToolResultsForPrompt, generateGroundedAnswer } from "@/lib/llm/chat";
import { rewriteQueryForRetrieval } from "@/lib/rag/queryRewrite";
import { retrieveRelevantChunks, type RetrievedChunk } from "@/lib/rag/retrieval";
import { runSalonToolRound, type SalonToolCallRecord } from "@/lib/tools/salonToolRound";

export type SalonPipelineInput = {
  message: string;
  topK: number;
};

export type SalonPipelineOutput = {
  answer: string;
  retrievalQuery: string;
  chunks: RetrievedChunk[];
  citations: Array<{ source: string; similarity: number; excerpt: string }>;
  toolResults: SalonToolCallRecord[];
};

type PipelineState = SalonPipelineInput & {
  retrievalQuery?: string;
  chunks?: RetrievedChunk[];
  toolResults?: SalonToolCallRecord[];
  toolContext?: string;
  answer?: string;
  citations?: SalonPipelineOutput["citations"];
};

/**
 * LangChain RunnableSequence: rewrite query → retrieve chunks → optional tool round → grounded answer.
 *
 * @param input - User message and retrieval top-k.
 * @returns Answer text, citations, tool invocation records, and the retrieval query used for embeddings.
 */
export async function runSalonPipeline(input: SalonPipelineInput): Promise<SalonPipelineOutput> {
  const chain = RunnableSequence.from([
    RunnableLambda.from(async (state: SalonPipelineInput): Promise<PipelineState> => {
      const retrievalQuery = await rewriteQueryForRetrieval(state.message);
      return { ...state, retrievalQuery };
    }),
    RunnableLambda.from(async (state: PipelineState): Promise<PipelineState> => {
      const chunks = await retrieveRelevantChunks(state.retrievalQuery ?? state.message, {
        embeddingModel: "text-embedding-3-small",
        matchCount: state.topK,
      });
      return { ...state, chunks };
    }),
    RunnableLambda.from(async (state: PipelineState): Promise<PipelineState> => {
      const toolResults = await runSalonToolRound(state.message);
      const toolContext = formatToolResultsForPrompt(toolResults);
      return { ...state, toolResults, toolContext };
    }),
    RunnableLambda.from(async (state: PipelineState): Promise<SalonPipelineOutput> => {
      const chunks = state.chunks ?? [];
      const toolContext = state.toolContext;
      const answer = await generateGroundedAnswer(state.message, chunks, toolContext);
      const citations = chunks.map((chunk) => ({
        source: chunk.source,
        similarity: chunk.similarity,
        excerpt: chunk.content.slice(0, 180),
      }));

      return {
        answer,
        retrievalQuery: state.retrievalQuery ?? state.message,
        chunks,
        citations,
        toolResults: state.toolResults ?? [],
      };
    }),
  ]);

  return chain.invoke(input);
}
