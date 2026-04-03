import { describe, expect, it } from "vitest";

import { chatRequestSchema } from "@/lib/validation/chatRequestSchema";

describe("chatRequestSchema", () => {
  it("accepts a minimal valid payload and applies defaults", () => {
    const result = chatRequestSchema.safeParse({ message: "Hello" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.message).toBe("Hello");
      expect(result.data.topK).toBe(4);
      expect(result.data.modelId).toBe("openai:gpt-4.1-mini");
      expect(result.data.locale).toBe("de");
    }
  });

  it("rejects empty or whitespace-only message", () => {
    expect(chatRequestSchema.safeParse({ message: "" }).success).toBe(false);
    expect(chatRequestSchema.safeParse({ message: "   " }).success).toBe(false);
  });

  it("rejects message over 2000 characters", () => {
    expect(
      chatRequestSchema.safeParse({ message: "x".repeat(2001) }).success,
    ).toBe(false);
  });

  it("rejects topK outside 1–8", () => {
    expect(
      chatRequestSchema.safeParse({ message: "hi", topK: 0 }).success,
    ).toBe(false);
    expect(
      chatRequestSchema.safeParse({ message: "hi", topK: 9 }).success,
    ).toBe(false);
  });

  it("rejects non-integer topK", () => {
    expect(
      chatRequestSchema.safeParse({ message: "hi", topK: 2.5 }).success,
    ).toBe(false);
  });

  it("rejects unknown modelId", () => {
    expect(
      chatRequestSchema.safeParse({
        message: "hi",
        modelId: "openai:unknown",
      }).success,
    ).toBe(false);
  });

  it("rejects unknown locale", () => {
    expect(
      chatRequestSchema.safeParse({ message: "hi", locale: "fr" }).success,
    ).toBe(false);
  });

  it("trims message", () => {
    const result = chatRequestSchema.safeParse({ message: "  cut  " });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.message).toBe("cut");
    }
  });
});
