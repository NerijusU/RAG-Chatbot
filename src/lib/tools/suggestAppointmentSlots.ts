import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { tool } from "@langchain/core/tools";
import { z } from "zod";

const BOOKING_POLICY_DISPLAY = "data/hair-salon/policies/booking-policy.md";

const suggestAppointmentSlotsSchema = z.object({
  preferredDay: z
    .enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"])
    .describe("Preferred weekday for the visit."),
  timeOfDay: z
    .enum(["morning", "afternoon", "evening", "any"])
    .describe("Rough time preference."),
});

let cachedBookingPolicy: string | null = null;

/**
 * Loads the canonical booking policy markdown from the repo (cached per runtime).
 *
 * @param none - This function does not accept any parameters.
 * @returns UTF-8 contents of `booking-policy.md`.
 * @throws Error if the file cannot be read.
 */
async function loadBookingPolicyMarkdown(): Promise<string> {
  if (cachedBookingPolicy !== null) {
    return cachedBookingPolicy;
  }

  const absolutePath = join(process.cwd(), "data", "hair-salon", "policies", "booking-policy.md");
  cachedBookingPolicy = await readFile(absolutePath, "utf8");
  return cachedBookingPolicy;
}

type ParsedBookingHours = {
  weekdayStartMin: number;
  weekdayEndMin: number;
  lastAppointmentStartMin: number;
};

/**
 * Extracts working-hour numbers from `booking-policy.md` bullet lines (falls back if patterns missing).
 *
 * @param markdown - Full booking policy markdown.
 * @returns Parsed minute-of-day values for weekday open/close and last bookable start.
 */
function parseBookingHours(markdown: string): ParsedBookingHours {
  const fallback: ParsedBookingHours = {
    weekdayStartMin: 10 * 60,
    weekdayEndMin: 19 * 60,
    lastAppointmentStartMin: 18 * 60,
  };

  const range = markdown.match(/Monday-Friday\s+(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/i);
  if (!range) {
    return fallback;
  }

  const startH = Number.parseInt(range[1] ?? "10", 10);
  const startM = Number.parseInt(range[2] ?? "00", 10);
  const endH = Number.parseInt(range[3] ?? "19", 10);
  const endM = Number.parseInt(range[4] ?? "00", 10);

  const last = markdown.match(/Last appointment slot:\s*(\d{1,2}):(\d{2})/i);
  const lastH = last ? Number.parseInt(last[1] ?? "18", 10) : 18;
  const lastM = last ? Number.parseInt(last[2] ?? "00", 10) : 0;

  return {
    weekdayStartMin: startH * 60 + startM,
    weekdayEndMin: endH * 60 + endM,
    lastAppointmentStartMin: lastH * 60 + lastM,
  };
}

/**
 * Converts minutes from midnight to HH:MM (24h).
 *
 * @param totalMinutes - Minutes since midnight.
 * @returns Zero-padded time string.
 */
function formatClock(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Picks up to `count` example start times inside [startMin, endMin] inclusive.
 *
 * @param startMin - Earliest slot start (minutes from midnight).
 * @param endMin - Latest slot start (minutes from midnight).
 * @param count - Number of sample times.
 * @returns Sorted unique clock strings.
 */
function sampleSlotsInRange(startMin: number, endMin: number, count: number): string[] {
  if (endMin < startMin) {
    return [];
  }

  const span = endMin - startMin;
  if (span === 0) {
    return [formatClock(startMin)];
  }

  const out: number[] = [];
  for (let i = 1; i <= count; i += 1) {
    const t = Math.round(startMin + (span * i) / (count + 1));
    const clamped = Math.min(Math.max(t, startMin), endMin);
    out.push(clamped);
  }

  return [...new Set(out)].sort((a, b) => a - b).map(formatClock);
}

const WEEKDAYS = new Set(["monday", "tuesday", "wednesday", "thursday", "friday"]);

/**
 * Builds example slot labels from policy hours and time-of-day band.
 *
 * @param preferredDay - Lowercase weekday name from the tool input.
 * @param timeOfDay - Morning / afternoon / evening / any.
 * @param hours - Parsed limits from booking policy.
 * @returns Clock strings only (caller prefixes weekday).
 */
function slotsForPreference(
  preferredDay: string,
  timeOfDay: "morning" | "afternoon" | "evening" | "any",
  hours: ParsedBookingHours,
): string[] {
  const day = preferredDay.toLowerCase();
  if (day === "sunday") {
    return [];
  }
  if (day === "saturday") {
    return [];
  }
  if (!WEEKDAYS.has(day)) {
    return [];
  }

  const open = hours.weekdayStartMin;
  const lastStart = Math.min(hours.lastAppointmentStartMin, hours.weekdayEndMin);

  const noon = 12 * 60;
  const midAfternoon = 15 * 60;

  let bandStart = open;
  let bandEnd = lastStart;

  if (timeOfDay === "morning") {
    bandEnd = Math.min(noon - 1, lastStart);
  } else if (timeOfDay === "afternoon") {
    bandStart = Math.max(open, noon);
    bandEnd = Math.min(midAfternoon - 1, lastStart);
  } else if (timeOfDay === "evening") {
    bandStart = Math.max(open, midAfternoon);
    bandEnd = lastStart;
  }

  if (bandEnd < bandStart) {
    return sampleSlotsInRange(open, lastStart, 3);
  }

  return sampleSlotsInRange(bandStart, bandEnd, 3);
}

/**
 * Tool: loads `booking-policy.md`, returns policy text, and suggests example times derived from parsed working hours (not a live calendar).
 */
export const suggestAppointmentSlotsTool = tool(
  async ({ preferredDay, timeOfDay }) => {
    try {
      const policyMarkdown = await loadBookingPolicyMarkdown();
      const hours = parseBookingHours(policyMarkdown);
      const dayKey = preferredDay.toLowerCase();

      const suggestedClocks = slotsForPreference(dayKey, timeOfDay, hours);
      const suggestedSlots = suggestedClocks.map((t) => `${preferredDay} ${t}`);

      const notes: string[] = [
        "Suggested times follow booking-policy hours only (illustrative, not a live calendar). For self-service booking, use the SumUp URL from retrieved context when available; otherwise contact nk-studio.org / info@nk-studio.org.",
      ];

      if (dayKey === "sunday") {
        notes.push("Sunday: day off per booking policy — no routine slots.");
      } else if (dayKey === "saturday") {
        notes.push("Saturday: only with separate agreement per booking policy — contact the studio.");
      }

      return JSON.stringify({
        preferredDay,
        timeOfDay,
        stylist: "Natallia Khatsei",
        sourcePath: BOOKING_POLICY_DISPLAY,
        bookingPolicyMarkdown: policyMarkdown,
        parsedHours: {
          weekdayWindow: `${formatClock(hours.weekdayStartMin)}–${formatClock(hours.weekdayEndMin)}`,
          lastAppointmentStart: formatClock(hours.lastAppointmentStartMin),
        },
        suggestedSlots,
        notes,
      });
    } catch {
      return JSON.stringify({
        preferredDay,
        timeOfDay,
        found: false,
        message:
          "Could not load booking-policy.md. Use retrieved knowledge-base context for hours and contact details.",
      });
    }
  },
  {
    name: "suggest_appointment_slots",
    description:
      "Load NK Studio booking policy from data/hair-salon/policies/booking-policy.md and suggest example slot times that fit the published working hours (not real availability).",
    schema: suggestAppointmentSlotsSchema,
  },
);
