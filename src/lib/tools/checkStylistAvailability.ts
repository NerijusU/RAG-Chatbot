import { tool } from "@langchain/core/tools";
import { z } from "zod";

const checkStylistAvailabilitySchema = z.object({
  date: z.string().describe("Appointment date as YYYY-MM-DD (ISO)."),
  serviceName: z
    .string()
    .optional()
    .describe("Optional service name, e.g. haircut, balayage, blowout."),
});

/**
 * Tool: returns illustrative availability for the single stylist (Natallia Khatsei). Self-service booking is live via SumUp; this tool does not read a live calendar.
 */
export const checkStylistAvailabilityTool = tool(
  async ({ date, serviceName }) => {
    const service = serviceName?.trim() || "general appointment";
    return JSON.stringify({
      date,
      service,
      stylist: "Natallia Khatsei",
      studioIsSingleStylist: true,
      illustrativeOpenSlots: 4,
      onlineBookingStatus: "sumup_self_service_live",
      bookingNextStep:
        "Share the canonical SumUp Bookings URL from retrieved context when the user wants to book online. This tool is illustrative only — confirm real slots on SumUp or by contacting info@nk-studio.org / nk-studio.org.",
      note: "Illustrative tool output only — real availability must be confirmed on SumUp or with the studio.",
    });
  },
  {
    name: "check_stylist_availability",
    description:
      "Check illustrative availability for Natallia Khatsei (sole stylist) on a date. Use when the user asks about booking, scheduling, or whether she is free. Prefer the SumUp link from retrieved context for self-service booking; remind that this tool does not reflect a live calendar.",
    schema: checkStylistAvailabilitySchema,
  },
);
