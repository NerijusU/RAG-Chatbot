/**
 * Provider/model ids exposed to the client and validated by the API.
 */
export const SUPPORTED_MODEL_IDS = [
  "openai:gpt-4.1-mini",
  "openai:gpt-4.1-nano",
  "anthropic:claude-haiku-4-5",
] as const;

export type SupportedModelId = (typeof SUPPORTED_MODEL_IDS)[number];

export type ModelCatalogEntry = {
  id: SupportedModelId;
  provider: "openai" | "anthropic";
  model: string;
  label: string;
  inputUsdPerMillion: number;
  outputUsdPerMillion: number;
};

/**
 * Centralized model metadata used for selector labels and cost estimation.
 */
export const MODEL_CATALOG: Record<SupportedModelId, ModelCatalogEntry> = {
  "openai:gpt-4.1-mini": {
    id: "openai:gpt-4.1-mini",
    provider: "openai",
    model: "gpt-4.1-mini",
    label: "OpenAI · GPT-4.1 Mini",
    inputUsdPerMillion: 0.4,
    outputUsdPerMillion: 1.6,
  },
  "openai:gpt-4.1-nano": {
    id: "openai:gpt-4.1-nano",
    provider: "openai",
    model: "gpt-4.1-nano",
    label: "OpenAI · GPT-4.1 Nano",
    inputUsdPerMillion: 0.1,
    outputUsdPerMillion: 0.4,
  },
  "anthropic:claude-haiku-4-5": {
    id: "anthropic:claude-haiku-4-5",
    provider: "anthropic",
    model: "claude-haiku-4-5",
    label: "Anthropic · Claude Haiku 4.5",
    inputUsdPerMillion: 1,
    outputUsdPerMillion: 5,
  },
};

/**
 * Default model used when client does not specify one.
 */
export const DEFAULT_MODEL_ID: SupportedModelId = "openai:gpt-4.1-mini";
