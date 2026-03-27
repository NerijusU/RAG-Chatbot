import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { generateGroundedAnswer } from "@/lib/llm/chat";
import { retrieveRelevantChunks } from "@/lib/rag/retrieval";

const requestSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  topK: z.number().int().min(1).max(8).default(4),
});

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const requestLog = new Map<string, number[]>();

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
    const parsedBody = requestSchema.safeParse(body);

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

    const { message, topK } = parsedBody.data;
    const chunks = await retrieveRelevantChunks(message, {
      embeddingModel: "text-embedding-3-small",
      matchCount: topK,
    });
    const answer = await generateGroundedAnswer(message, chunks);
    const citations = chunks.map((chunk) => ({
      source: chunk.source,
      similarity: chunk.similarity,
      excerpt: chunk.content.slice(0, 180),
    }));

    return NextResponse.json(
      {
        ok: true,
        answer,
        citations,
      },
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected chat request failure.";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
