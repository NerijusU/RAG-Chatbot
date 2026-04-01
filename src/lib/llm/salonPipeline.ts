import { RunnableLambda, RunnableSequence } from "@langchain/core/runnables";

import type { Locale } from "@/i18n";
import { formatToolResultsForPrompt, generateGroundedAnswer } from "@/lib/llm/chat";
import type { SupportedModelId } from "@/lib/llm/modelCatalog";
import {
  estimateCostUsd,
  sumTokenUsage,
  type TokenUsage,
  type UsageSummary,
} from "@/lib/llm/usage";
import { rewriteQueryForRetrieval } from "@/lib/rag/queryRewrite";
import { retrieveRelevantChunks, type RetrievedChunk } from "@/lib/rag/retrieval";
import {
  runSalonToolRound,
  type SalonToolCallRecord,
} from "@/lib/tools/salonToolRound";

export type SalonPipelineInput = {
  message: string;
  topK: number;
  modelId: SupportedModelId;
  locale: Locale;
};

export type SalonPipelineOutput = {
  answer: string;
  retrievalQuery: string;
  chunks: RetrievedChunk[];
  citations: Array<{ source: string; similarity: number; excerpt: string }>;
  toolResults: SalonToolCallRecord[];
  usage: UsageSummary;
};

type PipelineState = SalonPipelineInput & {
  retrievalQuery?: string;
  chunks?: RetrievedChunk[];
  toolResults?: SalonToolCallRecord[];
  toolContext?: string;
  usage?: TokenUsage;
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
      const rewrite = await rewriteQueryForRetrieval(state.message, state.modelId);
      return { ...state, retrievalQuery: rewrite.query, usage: rewrite.usage };
    }),
    RunnableLambda.from(async (state: PipelineState): Promise<PipelineState> => {
      const chunks = await retrieveRelevantChunks(state.retrievalQuery ?? state.message, {
        embeddingModel: "text-embedding-3-small",
        matchCount: state.topK,
      });
      return { ...state, chunks };
    }),
    RunnableLambda.from(async (state: PipelineState): Promise<PipelineState> => {
      const toolRound = await runSalonToolRound(state.message, state.modelId);
      const toolContext = formatToolResultsForPrompt(toolRound.records);
      return {
        ...state,
        toolResults: toolRound.records,
        toolContext,
        usage: sumTokenUsage(
          state.usage ?? { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
          toolRound.usage,
        ),
      };
    }),
    RunnableLambda.from(async (state: PipelineState): Promise<SalonPipelineOutput> => {
      const chunks = state.chunks ?? [];
      const toolContext = state.toolContext;
      const grounded = await generateGroundedAnswer(
        state.message,
        chunks,
        toolContext,
        state.modelId,
        state.locale,
      );
      const citations = chunks.map((chunk) => ({
        source: chunk.source,
        similarity: chunk.similarity,
        excerpt: chunk.content.slice(0, 180),
      }));
      const totalUsage = sumTokenUsage(
        state.usage ?? { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
        grounded.usage,
      );

      return {
        answer: grounded.answer,
        retrievalQuery: state.retrievalQuery ?? state.message,
        chunks,
        citations,
        toolResults: state.toolResults ?? [],
        usage: {
          modelId: state.modelId,
          inputTokens: totalUsage.inputTokens,
          outputTokens: totalUsage.outputTokens,
          totalTokens: totalUsage.totalTokens,
          estimatedCostUsd: estimateCostUsd(totalUsage, state.modelId),
        },
      };
    }),
  ]);

  return chain.invoke(input);
}
