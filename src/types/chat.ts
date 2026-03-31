import type { SupportedModelId } from "@/lib/llm/modelCatalog";

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

export type ChatUsage = {
  modelId: SupportedModelId;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
};

export type ChatMessage =
  | { id: string; role: "user"; content: string }
  | {
      id: string;
      role: "assistant";
      content: string;
      citations?: ChatCitation[];
      toolResults?: ChatToolResult[];
      usage?: ChatUsage;
    };

export type ChatApiSuccess = {
  ok: true;
  answer: string;
  citations: ChatCitation[];
  toolResults: ChatToolResult[];
  usage: ChatUsage;
};

export type ChatApiError = {
  ok: false;
  error: string;
};
