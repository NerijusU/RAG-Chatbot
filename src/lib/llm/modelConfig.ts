import { DEFAULT_MODEL_ID } from "@/lib/llm/modelCatalog";

/**
 * Shared chat model settings for LangChain chat calls.
 */
export const CHAT_MODEL_CONFIG = {
  defaultModelId: DEFAULT_MODEL_ID,
  temperature: 0.2,
} as const;

export const OPENAI_TIMEOUT_MS = 25_000;
