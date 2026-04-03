import { z } from "zod";

import { defaultLocale, locales } from "@/i18n";
import {
  DEFAULT_MODEL_ID,
  SUPPORTED_MODEL_IDS,
} from "@/lib/llm/modelCatalog";

/**
 * Zod schema for `POST /api/chat` JSON body: message, optional topK/modelId/locale.
 */
export const chatRequestSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  topK: z.number().int().min(1).max(8).default(4),
  modelId: z.enum(SUPPORTED_MODEL_IDS).default(DEFAULT_MODEL_ID),
  locale: z.enum(locales).default(defaultLocale),
});

export type ChatRequestBody = z.infer<typeof chatRequestSchema>;
