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
 * Tool: returns illustrative availability for the single stylist (Natallia Khatsei); online booking is not live yet.
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
      onlineBookingStatus: "not_activated_yet",
      bookingNextStep:
        "Contact the studio via info@nk-studio.org or nk-studio.org until self-service booking goes live (planned: SumUp Bookings-style page, similar to common salon booking sites).",
      note: "Illustrative tool output only — real availability must be confirmed with Natallia / the studio.",
    });
  },
  {
    name: "check_stylist_availability",
    description:
      "Check illustrative availability for Natallia Khatsei (sole stylist) on a date. Use when the user asks about booking, scheduling, or whether she is free. Remind that online booking is not active yet and contact is required until it launches.",
    schema: checkStylistAvailabilitySchema,
  },
);
