import { describe, expect, it } from "vitest";

import {
  buildGroundedInput,
  buildGroundedInstructions,
  formatToolResultsForPrompt,
} from "@/lib/llm/chat";
import type { RetrievedChunk } from "@/lib/rag/retrieval";

describe("formatToolResultsForPrompt", () => {
  it("returns undefined for an empty list", () => {
    expect(formatToolResultsForPrompt([])).toBeUndefined();
  });

  it("formats successful tool lines", () => {
    const out = formatToolResultsForPrompt([
      { name: "get_service_price", ok: true, output: '{"price":42}' },
    ]);
    expect(out).toBe('get_service_price: {"price":42}');
  });

  it("prefixes errors", () => {
    const out = formatToolResultsForPrompt([
      { name: "check_stylist_availability", ok: false, output: "bad date" },
    ]);
    expect(out).toBe("check_stylist_availability: Error: bad date");
  });
});

describe("buildGroundedInput", () => {
  it("uses placeholder when there are no chunks", () => {
    const body = buildGroundedInput("Q?", []);
    expect(body).toContain("No context found.");
    expect(body).toContain("<user_message>");
    expect(body).toContain("Q?");
    expect(body).toContain("<tool_results>");
    expect(body).toContain("None.");
  });

  it("includes numbered sources and separator between chunks", () => {
    const chunks: RetrievedChunk[] = [
      {
        source: "a.md",
        content: "  line  ",
        metadata: null,
        similarity: 0.9,
      },
      {
        source: "b.md",
        content: "two",
        metadata: null,
        similarity: 0.8,
      },
    ];
    const body = buildGroundedInput("Hi", chunks, "tool: ok");
    expect(body).toContain("Source 1: a.md");
    expect(body).toContain("line");
    expect(body).toContain("\n\n---\n\n");
    expect(body).toContain("Source 2: b.md");
    expect(body).toContain("tool: ok");
  });
});

describe("buildGroundedInstructions", () => {
  it("mentions reply language for German locale", () => {
    const text = buildGroundedInstructions("de");
    expect(text).toContain("German");
  });

  it("mentions reply language for English locale", () => {
    const text = buildGroundedInstructions("en");
    expect(text).toContain("English");
  });

  it("includes delimiter guardrail for user_message", () => {
    const text = buildGroundedInstructions("en");
    expect(text.toLowerCase()).toContain("user_message");
  });
});
