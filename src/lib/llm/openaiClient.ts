import OpenAI from "openai";

import { getRequiredEnv } from "@/lib/env";
import { OPENAI_TIMEOUT_MS } from "@/lib/llm/modelConfig";

let cachedClient: OpenAI | null = null;

/**
 * Returns a singleton OpenAI client with timeout and limited retries for embeddings and HTTP calls.
 *
 * @param none - This function does not accept any parameters.
 * @returns Configured OpenAI SDK client instance.
 */
export function getOpenAIClient(): OpenAI {
  if (!cachedClient) {
    cachedClient = new OpenAI({
      apiKey: getRequiredEnv("OPENAI_API_KEY"),
      timeout: OPENAI_TIMEOUT_MS,
      maxRetries: 1,
    });
  }

  return cachedClient;
}
