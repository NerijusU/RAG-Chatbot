import { NextRequest, NextResponse } from "next/server";

import { getRequiredEnv } from "@/lib/env";
import { runSalonPipeline } from "@/lib/llm/salonPipeline";
import { logChatTelemetry } from "@/lib/logging/chatTelemetry";
import { chatRequestSchema } from "@/lib/validation/chatRequestSchema";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const requestLog = new Map<string, number[]>();

/** User-visible copy for unexpected failures; never echo upstream env/DB/LLM errors. */
const CLIENT_INTERNAL_ERROR =
  "Something went wrong. Please try again.";

/**
 * Removes client keys that have no timestamps in the current window.
 *
 * @param now - Current time in milliseconds.
 * @returns Nothing. Mutates the in-memory request log map.
 */
function pruneStaleClientKeys(now: number): void {
  const since = now - RATE_LIMIT_WINDOW_MS;

  for (const [key, timestamps] of requestLog.entries()) {
    const recent = timestamps.filter((timestamp) => timestamp >= since);

    if (recent.length === 0) {
      requestLog.delete(key);
      continue;
    }

    if (recent.length !== timestamps.length) {
      requestLog.set(key, recent);
    }
  }
}

/**
 * Extracts a stable client identifier for simple in-memory rate limiting.
 *
 * @param request - Incoming API request.
 * @returns Best-effort client key from forwarding headers or host fallback.
 */
function getClientKey(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  const fallback = request.headers.get("host") ?? "unknown-client";
  return forwardedFor || realIp || fallback;
}

/**
 * Applies a fixed-window in-memory rate limit per client key.
 *
 * @param clientKey - Client identifier used for request accounting.
 * @returns True if request is allowed, false if limit exceeded.
 */
function isRequestAllowed(clientKey: string): boolean {
  const now = Date.now();
  pruneStaleClientKeys(now);
  const since = now - RATE_LIMIT_WINDOW_MS;
  const previous = requestLog.get(clientKey) ?? [];
  const recent = previous.filter((timestamp) => timestamp >= since);

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestLog.set(clientKey, recent);
    return false;
  }

  recent.push(now);
  requestLog.set(clientKey, recent);
  return true;
}

/**
 * Handles chat requests with retrieval-augmented response generation.
 *
 * @param request - API request containing user message and optional top-k value.
 * @returns JSON response with answer text and source citations.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const clientKey = getClientKey(request);
    if (!isRequestAllowed(clientKey)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Rate limit exceeded. Please wait a minute and retry.",
        },
        { status: 429 },
      );
    }

    const body = await request.json().catch(() => ({}));
    const parsedBody = chatRequestSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid request payload.",
          details: parsedBody.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { message, topK, modelId, locale } = parsedBody.data;
    if (modelId.startsWith("anthropic:")) {
      try {
        getRequiredEnv("ANTHROPIC_API_KEY");
      } catch {
        return NextResponse.json(
          {
            ok: false,
            error:
              "Anthropic model selected, but ANTHROPIC_API_KEY is missing on the server.",
          },
          { status: 500 },
        );
      }
    }
    const started = Date.now();

    const pipeline = await runSalonPipeline({ message, topK, modelId, locale });

    logChatTelemetry("chat_ok", {
      ms: Date.now() - started,
      messageLen: message.length,
      citationCount: pipeline.citations.length,
      toolInvocationCount: pipeline.toolResults.length,
      chunkCount: pipeline.chunks.length,
      inputTokens: pipeline.usage.inputTokens,
      outputTokens: pipeline.usage.outputTokens,
      totalTokens: pipeline.usage.totalTokens,
      modelId: pipeline.usage.modelId,
      locale,
    });

    return NextResponse.json(
      {
        ok: true,
        answer: pipeline.answer,
        citations: pipeline.citations,
        toolResults: pipeline.toolResults,
        usage: pipeline.usage,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[api/chat]", error);
    const errText =
      error instanceof Error ? error.message : "Unexpected chat request failure.";

    logChatTelemetry("chat_error", {
      err: errText.slice(0, 120),
    });

    return NextResponse.json(
      {
        ok: false,
        error: CLIENT_INTERNAL_ERROR,
      },
      { status: 500 },
    );
  }
}
