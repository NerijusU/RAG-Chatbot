/**
 * Normalizes LangChain `AIMessage` / model `content` into a single string (handles string or content-part arrays).
 *
 * @param content - Raw `message.content` from a chat model response (string, part array, or other).
 * @returns Concatenated text from string or `{ text }` parts; other shapes become `String(content)`.
 */
export function normalizeLlmContent(content: unknown): string {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((part) =>
        typeof part === "object" && part !== null && "text" in part
          ? String((part as { text: unknown }).text)
          : "",
      )
      .join("");
  }

  return String(content);
}
