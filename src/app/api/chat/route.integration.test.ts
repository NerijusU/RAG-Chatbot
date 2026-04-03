import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { SalonPipelineOutput } from "@/lib/llm/salonPipeline";

vi.mock("@/lib/llm/salonPipeline", () => ({
  runSalonPipeline: vi.fn(),
}));

vi.mock("@/lib/logging/chatTelemetry", () => ({
  logChatTelemetry: vi.fn(),
}));

import { POST } from "@/app/api/chat/route";
import { runSalonPipeline } from "@/lib/llm/salonPipeline";

const mockPipelineResult: SalonPipelineOutput = {
  answer: "Mocked grounded answer",
  retrievalQuery: "mock query",
  chunks: [],
  citations: [
    {
      source: "policies/example.md",
      similarity: 0.95,
      excerpt: "Excerpt text",
    },
  ],
  toolResults: [],
  usage: {
    modelId: "openai:gpt-4.1-mini",
    inputTokens: 100,
    outputTokens: 50,
    totalTokens: 150,
    estimatedCostUsd: 0.0001,
  },
};

function chatRequest(body: unknown, clientIp: string): NextRequest {
  return new NextRequest("http://localhost/api/chat", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": clientIp,
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/chat (integration, mocked pipeline)", () => {
  beforeEach(() => {
    vi.mocked(runSalonPipeline).mockClear();
    vi.mocked(runSalonPipeline).mockResolvedValue(mockPipelineResult);
  });

  it("returns 200 with pipeline output when body is valid", async () => {
    const res = await POST(
      chatRequest({ message: "What is a balayage?" }, "10.0.0.1"),
    );
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      ok: boolean;
      answer?: string;
      citations?: unknown[];
    };
    expect(json.ok).toBe(true);
    expect(json.answer).toBe("Mocked grounded answer");
    expect(json.citations).toHaveLength(1);

    expect(runSalonPipeline).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "What is a balayage?",
        topK: 4,
        modelId: "openai:gpt-4.1-mini",
        locale: "de",
      }),
    );
  });

  it("returns 400 when validation fails", async () => {
    const res = await POST(
      chatRequest({ message: "" }, "10.0.0.2"),
    );
    expect(res.status).toBe(400);
    const json = (await res.json()) as { ok: boolean };
    expect(json.ok).toBe(false);
    expect(runSalonPipeline).not.toHaveBeenCalled();
  });
});
