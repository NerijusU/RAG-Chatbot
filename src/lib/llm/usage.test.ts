import { AIMessage } from "@langchain/core/messages";
import { describe, expect, it } from "vitest";

import {
  estimateCostUsd,
  extractTokenUsage,
  sumTokenUsage,
} from "@/lib/llm/usage";

describe("extractTokenUsage", () => {
  it("reads snake_case usage_metadata", () => {
    const msg = new AIMessage("x");
    (msg as { usage_metadata?: object }).usage_metadata = {
      input_tokens: 10,
      output_tokens: 20,
      total_tokens: 30,
    };
    expect(extractTokenUsage(msg)).toEqual({
      inputTokens: 10,
      outputTokens: 20,
      totalTokens: 30,
    });
  });

  it("falls back to input+output when total missing", () => {
    const msg = new AIMessage("x");
    (msg as { usage_metadata?: object }).usage_metadata = {
      input_tokens: 3,
      output_tokens: 4,
    };
    expect(extractTokenUsage(msg).totalTokens).toBe(7);
  });

  it("returns zeros when no usage present", () => {
    expect(extractTokenUsage(new AIMessage("hi"))).toEqual({
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
    });
  });
});

describe("sumTokenUsage", () => {
  it("adds fields", () => {
    expect(
      sumTokenUsage(
        { inputTokens: 1, outputTokens: 2, totalTokens: 3 },
        { inputTokens: 10, outputTokens: 20, totalTokens: 30 },
      ),
    ).toEqual({ inputTokens: 11, outputTokens: 22, totalTokens: 33 });
  });
});

describe("estimateCostUsd", () => {
  it("returns a non-negative number for a known model", () => {
    const n = estimateCostUsd(
      { inputTokens: 1_000_000, outputTokens: 0, totalTokens: 1_000_000 },
      "openai:gpt-4.1-nano",
    );
    expect(n).toBeGreaterThanOrEqual(0);
    expect(Number.isFinite(n)).toBe(true);
  });
});
