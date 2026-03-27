import OpenAI from "openai";

import { getRequiredEnv } from "@/lib/env";
import type { RetrievedChunk } from "@/lib/rag/retrieval";

type ChatModelConfig = {
  model: string;
  temperature: number;
};

const CHAT_MODEL_CONFIG: ChatModelConfig = {
  model: "gpt-4.1-mini",
  temperature: 0.2,
};

/**
 * Builds system-level instructions for grounded domain chatbot behavior.
 *
 * @returns System instructions used by the Responses API.
 */
function buildGroundedInstructions(): string {
  return [
    "You are a hair salon assistant.",
    "Answer only using the provided context when possible.",
    "If context is insufficient, say what is missing clearly and briefly.",
    "Keep the answer concise and practical.",
  ].join("\n");
}

/**
 * Builds retrieval-grounded input content containing context and user question.
 *
 * @param question - User message content.
 * @param chunks - Retrieved context chunks from vector search.
 * @returns Input text containing context and the user question.
 */
function buildGroundedInput(question: string, chunks: RetrievedChunk[]): string {
  const contextBlock = chunks
    .map(
      (chunk, index) =>
        `Source ${index + 1}: ${chunk.source}\n${chunk.content.trim()}`,
    )
    .join("\n\n---\n\n");

  return [
    "Context:",
    contextBlock || "No context found.",
    "",
    `Question: ${question}`,
  ].join("\n");
}

/**
 * Generates a grounded chatbot answer from retrieved chunks.
 *
 * @param question - User question for the assistant.
 * @param chunks - Retrieved context chunks.
 * @returns Final assistant answer text.
 */
export async function generateGroundedAnswer(
  question: string,
  chunks: RetrievedChunk[],
): Promise<string> {
  const client = new OpenAI({
    apiKey: getRequiredEnv("OPENAI_API_KEY"),
  });

  const response = await client.responses.create({
    model: CHAT_MODEL_CONFIG.model,
    instructions: buildGroundedInstructions(),
    input: buildGroundedInput(question, chunks),
    temperature: CHAT_MODEL_CONFIG.temperature,
  });

  return response.output_text.trim();
}
