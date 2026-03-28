import { ChatOpenAI } from "@langchain/openai";

import { CHAT_MODEL_CONFIG, OPENAI_TIMEOUT_MS } from "@/lib/llm/modelConfig";

/**
 * Creates a configured ChatOpenAI instance for salon chat, query rewrite, and tool routing.
 *
 * @param overrides - Optional partial model settings (e.g. lower temperature for rewriting).
 * @returns ChatOpenAI runnable model instance.
 */
export function createSalonChatModel(
  overrides: Partial<{ temperature: number }> = {},
): ChatOpenAI {
  return new ChatOpenAI({
    model: CHAT_MODEL_CONFIG.model,
    temperature: overrides.temperature ?? CHAT_MODEL_CONFIG.temperature,
    timeout: OPENAI_TIMEOUT_MS,
    maxRetries: 1,
  });
}
