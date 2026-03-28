import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { createSalonChatModel } from "@/lib/llm/createSalonChatModel";

const rewriter = createSalonChatModel({ temperature: 0 });

/**
 * Rewrites the user message into a concise standalone query to improve embedding retrieval.
 *
 * @param userMessage - Raw user chat text.
 * @returns A short search query; falls back to the original message if the model returns empty text.
 */
export async function rewriteQueryForRetrieval(userMessage: string): Promise<string> {
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
  return trimmed.length > 0 ? trimmed : userMessage;
}
