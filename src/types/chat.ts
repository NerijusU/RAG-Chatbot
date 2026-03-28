export type ChatCitation = {
  source: string;
  similarity: number;
  excerpt: string;
};

export type ChatToolResult = {
  name: string;
  ok: boolean;
  output: string;
};

export type ChatMessage =
  | { id: string; role: "user"; content: string }
  | {
      id: string;
      role: "assistant";
      content: string;
      citations?: ChatCitation[];
      toolResults?: ChatToolResult[];
    };

export type ChatApiSuccess = {
  ok: true;
  answer: string;
  citations: ChatCitation[];
  toolResults: ChatToolResult[];
};

export type ChatApiError = {
  ok: false;
  error: string;
};
