import { AIMessage } from "@langchain/core/messages";

import {
  DEFAULT_MODEL_ID,
  MODEL_CATALOG,
  type SupportedModelId,
} from "@/lib/llm/modelCatalog";

export type TokenUsage = {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
};

export type UsageSummary = TokenUsage & {
  modelId: SupportedModelId;
  estimatedCostUsd: number;
};

type UsageLike = Partial<{
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}>;

/**
 * Reads token usage from a LangChain AIMessage across common provider-specific shapes.
 *
 * @param message - AI message returned by a chat model invocation.
 * @returns Normalized token counts (zeros when unavailable).
 */
export function extractTokenUsage(message: AIMessage): TokenUsage {
  const usageMetadata = (message as { usage_metadata?: UsageLike }).usage_metadata;
  const responseUsage = (
    message.response_metadata as
      | { tokenUsage?: UsageLike; usage?: UsageLike }
      | undefined
  )?.tokenUsage ??
    (
      message.response_metadata as
        | { tokenUsage?: UsageLike; usage?: UsageLike }
        | undefined
    )?.usage;

  const merged: UsageLike = {
    ...(usageMetadata ?? {}),
    ...(responseUsage ?? {}),
  };

  const inputTokens = Number(merged.input_tokens ?? merged.inputTokens ?? 0);
  const outputTokens = Number(merged.output_tokens ?? merged.outputTokens ?? 0);
  const totalTokens =
    Number(merged.total_tokens ?? merged.totalTokens ?? 0) ||
    inputTokens + outputTokens;

  return { inputTokens, outputTokens, totalTokens };
}

/**
 * Adds two token usage objects together.
 *
 * @param left - First usage object.
 * @param right - Second usage object.
 * @returns Summed token counts.
 */
export function sumTokenUsage(left: TokenUsage, right: TokenUsage): TokenUsage {
  return {
    inputTokens: left.inputTokens + right.inputTokens,
    outputTokens: left.outputTokens + right.outputTokens,
    totalTokens: left.totalTokens + right.totalTokens,
  };
}

/**
 * Calculates estimated USD cost from token usage and model pricing table.
 *
 * @param usage - Token counts for one chat turn/pipeline.
 * @param modelId - Selected model id for pricing lookup.
 * @returns Estimated cost in USD.
 */
export function estimateCostUsd(
  usage: TokenUsage,
  modelId: SupportedModelId,
): number {
  const pricing = MODEL_CATALOG[modelId] ?? MODEL_CATALOG[DEFAULT_MODEL_ID];
  const inputUsd = (usage.inputTokens / 1_000_000) * pricing.inputUsdPerMillion;
  const outputUsd =
    (usage.outputTokens / 1_000_000) * pricing.outputUsdPerMillion;
  return inputUsd + outputUsd;
}
