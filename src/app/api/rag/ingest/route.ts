import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getRequiredEnv } from "@/lib/env";
import { ingestKnowledgeBase } from "@/lib/rag/ingest";

const requestSchema = z.object({
  dataDirectory: z
    .string()
    .trim()
    .min(1)
    .max(200)
    .regex(
      /^data(?:[\\/][a-zA-Z0-9_-]+)*$/,
      "dataDirectory must stay inside the data/ directory.",
    )
    .default("data/hair-salon"),
  embeddingModel: z.string().min(1).default("text-embedding-3-small"),
  chunkSize: z.number().int().min(200).max(4000).default(1200),
  chunkOverlap: z.number().int().min(0).max(800).default(200),
  replaceExisting: z.boolean().default(true),
}).superRefine((value, context) => {
  const pathParts = value.dataDirectory.split(/[\\/]/);
  if (pathParts.includes("..") || pathParts.includes(".")) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "dataDirectory cannot contain path traversal segments.",
      path: ["dataDirectory"],
    });
  }

  if (value.chunkOverlap >= value.chunkSize) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "chunkOverlap must be smaller than chunkSize.",
      path: ["chunkOverlap"],
    });
  }
});

/**
 * Authorizes ingestion requests using a shared secret token.
 *
 * @param request - Incoming API request.
 * @returns True when authorization header matches configured secret.
 */
function isAuthorizedIngestRequest(request: NextRequest): boolean {
  const configuredSecret = process.env.INGEST_API_KEY;
  if (!configuredSecret || configuredSecret.trim().length === 0) {
    return false;
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return false;
  }

  const token = authHeader.slice("Bearer ".length);
  return token === configuredSecret;
}

/**
 * Ingests markdown knowledge files into Supabase vector storage.
 *
 * @param request - API request containing optional ingestion options.
 * @returns JSON response with ingestion summary or validation errors.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    getRequiredEnv("INGEST_API_KEY");

    if (!isAuthorizedIngestRequest(request)) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized ingest request." },
        { status: 401 },
      );
    }

    getRequiredEnv("OPENAI_API_KEY");
    getRequiredEnv("SUPABASE_URL");
    getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");

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

    const summary = await ingestKnowledgeBase(parsedBody.data);

    return NextResponse.json(
      {
        ok: true,
        message: "Knowledge base ingestion completed.",
        summary,
      },
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected ingestion failure.";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
