import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { createSalonChatModel } from "@/lib/llm/createSalonChatModel";
import type { SupportedModelId } from "@/lib/llm/modelCatalog";
import { extractTokenUsage, type TokenUsage } from "@/lib/llm/usage";

export type QueryRewriteResult = {
  query: string;
  usage: TokenUsage;
};

/**
 * Rewrites the user message into a concise standalone query to improve embedding retrieval.
 *
 * @param userMessage - Raw user chat text.
 * @param modelId - Selected provider/model id for this chat request.
 * @returns Query text and usage metadata; falls back to the original message when rewrite is empty.
 */
export async function rewriteQueryForRetrieval(
  userMessage: string,
  modelId: SupportedModelId,
): Promise<QueryRewriteResult> {
  const rewriter = createSalonChatModel(modelId, { temperature: 0 });
  const response = await rewriter.invoke([
    new SystemMessage(
      [
        "Rewrite the user's message into a short standalone search query for a hair salon knowledge base.",
        "Include service names, concerns, or booking intent when relevant.",
        "Reply with only the search query text — no quotes, labels, or explanation.",
      ].join(" "),
    ),
    new HumanMessage(userMessage),
  ]);

  const raw =
    typeof response.content === "string"
      ? response.content
      : Array.isArray(response.content)
        ? response.content
            .map((part) => (typeof part === "object" && part && "text" in part ? String(part.text) : ""))
            .join("")
        : String(response.content);

  const trimmed = raw.trim();
  return {
    query: trimmed.length > 0 ? trimmed : userMessage,
    usage: extractTokenUsage(response),
  };
}
