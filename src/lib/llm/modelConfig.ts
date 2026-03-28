/**
 * Shared chat model settings for LangChain ChatOpenAI and related calls.
 */
export const CHAT_MODEL_CONFIG = {
  model: "gpt-4.1-mini",
  temperature: 0.2,
} as const;

export const OPENAI_TIMEOUT_MS = 25_000;
