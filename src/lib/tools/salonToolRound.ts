import { AIMessage, BaseMessage, HumanMessage, SystemMessage, ToolMessage } from "@langchain/core/messages";

import { createSalonChatModel } from "@/lib/llm/createSalonChatModel";
import type { SupportedModelId } from "@/lib/llm/modelCatalog";
import {
  extractTokenUsage,
  sumTokenUsage,
  type TokenUsage,
} from "@/lib/llm/usage";
import { checkStylistAvailabilityTool } from "@/lib/tools/checkStylistAvailability";
import { getServicePriceTool } from "@/lib/tools/getServicePrice";
import { suggestAppointmentSlotsTool } from "@/lib/tools/suggestAppointmentSlots";

export type SalonToolCallRecord = {
  name: string;
  ok: boolean;
  output: string;
};

export type SalonToolRoundResult = {
  records: SalonToolCallRecord[];
  usage: TokenUsage;
};

const SALON_TOOLS = [
  checkStylistAvailabilityTool,
  getServicePriceTool,
  suggestAppointmentSlotsTool,
] as const;

const TOOL_BY_NAME = Object.fromEntries(SALON_TOOLS.map((t) => [t.name, t]));

/** Shared invoke shape so TS can call tools looked up by name (each StructuredTool has distinct generic `invoke` overloads). */
type InvokableStructuredTool = {
  invoke: (input: Record<string, unknown>) => Promise<unknown>;
};

const MAX_TOOL_ROUNDS = 2;

/**
 * Runs up to two model turns that may invoke salon tools; executes tools server-side and returns structured records for the API/UI.
 *
 * @param userMessage - Original user text from the chat request.
 * @param modelId - Selected provider/model id for this chat request.
 * @returns One record per tool invocation plus cumulative token usage for tool-round model calls.
 */
export async function runSalonToolRound(
  userMessage: string,
  modelId: SupportedModelId,
): Promise<SalonToolRoundResult> {
  const llm = createSalonChatModel(modelId);
  const bound = llm.bindTools([...SALON_TOOLS], { tool_choice: "auto" });

  const records: SalonToolCallRecord[] = [];
  const messages: BaseMessage[] = [
    new SystemMessage(
      [
        "You route an assistant for NK Studio: one stylist, Natallia Khatsei.",
        "Online booking is not active yet; tools return illustrative data and should not imply a live public booking URL.",
        "Call tools only when the user needs availability checks, price hints, or suggested time windows.",
        "If a general FAQ or small talk does not need structured salon data, respond with a brief text answer and do not call tools.",
        "Prefer at most one round of tool calls when possible.",
      ].join(" "),
    ),
    new HumanMessage(userMessage),
  ];

  let totalUsage: TokenUsage = { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
  let response = await bound.invoke(messages);

  if (response instanceof AIMessage) {
    totalUsage = sumTokenUsage(totalUsage, extractTokenUsage(response));
  }

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    if (!(response instanceof AIMessage)) {
      break;
    }

    const calls = response.tool_calls ?? [];
    if (calls.length === 0) {
      break;
    }

    const followUp: BaseMessage[] = [...messages, response];

    for (const call of calls) {
      const runner = TOOL_BY_NAME[call.name] as InvokableStructuredTool | undefined;
      if (!runner) {
        records.push({
          name: call.name,
          ok: false,
          output: "Unknown tool requested.",
        });
        followUp.push(
          new ToolMessage({
            content: "Error: unknown tool.",
            tool_call_id: call.id ?? "unknown",
          }),
        );
        continue;
      }

      try {
        const args = call.args as Record<string, unknown>;
        const out = await runner.invoke(args);
        const text = typeof out === "string" ? out : JSON.stringify(out);
        records.push({ name: call.name, ok: true, output: text });
        followUp.push(
          new ToolMessage({
            content: text,
            tool_call_id: call.id ?? "unknown",
          }),
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : "Tool execution failed.";
        records.push({ name: call.name, ok: false, output: message });
        followUp.push(
          new ToolMessage({
            content: `Error: ${message}`,
            tool_call_id: call.id ?? "unknown",
          }),
        );
      }
    }

    messages.splice(0, messages.length, ...followUp);
    response = await bound.invoke(messages);
    if (response instanceof AIMessage) {
      totalUsage = sumTokenUsage(totalUsage, extractTokenUsage(response));
    }
  }

  return { records, usage: totalUsage };
}
