import { describe, expect, it } from "vitest";

import { normalizeLlmContent } from "@/lib/llm/normalizeLlmContent";

describe("normalizeLlmContent", () => {
  it("returns plain strings unchanged", () => {
    expect(normalizeLlmContent("hello")).toBe("hello");
  });

  it("joins array parts that expose text", () => {
    expect(
      normalizeLlmContent([{ text: "a" }, { text: "b" }]),
    ).toBe("ab");
  });

  it("ignores array entries without text", () => {
    expect(normalizeLlmContent([{ text: "x" }, { type: "image" }])).toBe("x");
  });

  it("stringifies other values", () => {
    expect(normalizeLlmContent(42)).toBe("42");
  });
});
