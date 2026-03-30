import { ChatAnthropic } from "@langchain/anthropic";
import { ChatOpenAI } from "@langchain/openai";

import { CHAT_MODEL_CONFIG, OPENAI_TIMEOUT_MS } from "@/lib/llm/modelConfig";
import { MODEL_CATALOG, type SupportedModelId } from "@/lib/llm/modelCatalog";

/**
 * Creates a configured chat model instance for salon chat, query rewrite, and tool routing.
 *
 * @param modelId - Selected provider/model id validated by the API.
 * @param overrides - Optional partial model settings (e.g. lower temperature for rewriting).
 * @returns Chat model runnable instance from the selected provider.
 */
export function createSalonChatModel(
  modelId: SupportedModelId = CHAT_MODEL_CONFIG.defaultModelId,
  overrides: Partial<{ temperature: number }> = {},
): ChatOpenAI | ChatAnthropic {
  const selected = MODEL_CATALOG[modelId];
  const temperature = overrides.temperature ?? CHAT_MODEL_CONFIG.temperature;

  if (selected.provider === "anthropic") {
    return new ChatAnthropic({
      model: selected.model,
      temperature,
      maxRetries: 1,
      clientOptions: { timeout: OPENAI_TIMEOUT_MS },
    });
  }

  return new ChatOpenAI({
    model: selected.model,
    temperature,
    timeout: OPENAI_TIMEOUT_MS,
    maxRetries: 1,
  });
}
