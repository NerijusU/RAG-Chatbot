import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { tool } from "@langchain/core/tools";
import { z } from "zod";

const PRICING_SOURCE_DISPLAY = "data/hair-salon/pricing/pricing.md";

const getServicePriceSchema = z.object({
  serviceName: z
    .string()
    .min(1)
    .describe("Service the guest asked about (used to focus the answer); full list is still returned from pricing.md."),
});

let cachedPricingMarkdown: string | null = null;

/**
 * Reads the canonical NK Studio price list from `data/hair-salon/pricing/pricing.md` (cached in memory per runtime).
 *
 * @param none - This function does not accept any parameters.
 * @returns Full UTF-8 contents of the pricing markdown file.
 * @throws Error when the file is missing or unreadable.
 */
async function loadPricingMarkdown(): Promise<string> {
  if (cachedPricingMarkdown !== null) {
    return cachedPricingMarkdown;
  }

  const absolutePath = join(process.cwd(), "data", "hair-salon", "pricing", "pricing.md");
  cachedPricingMarkdown = await readFile(absolutePath, "utf8");
  return cachedPricingMarkdown;
}

/**
 * Tool: loads official EUR pricing tables from the repo markdown (same file RAG ingests) — no duplicate price table in code.
 */
export const getServicePriceTool = tool(
  async ({ serviceName }) => {
    try {
      const pricingMarkdown = await loadPricingMarkdown();

      return JSON.stringify({
        serviceName,
        found: true,
        currency: "EUR",
        sourcePath: PRICING_SOURCE_DISPLAY,
        pricingMarkdown,
        usageHint:
          "Match the guest's question to the right section and quote EUR amounts from the tables. Mention Notes (e.g. hair density) when relevant. Final quote at the salon.",
      });
    } catch {
      return JSON.stringify({
        serviceName,
        found: false,
        currency: "EUR",
        message:
          "Could not load pricing.md from disk. Use retrieved knowledge-base chunks for pricing or ask the guest to check nk-studio.org / contact the studio.",
      });
    }
  },
  {
    name: "get_service_price",
    description:
      `Load the full NK Studio price list (EUR) from ${PRICING_SOURCE_DISPLAY}. Use when the user asks how much a service costs.`,
    schema: getServicePriceSchema,
  },
);
