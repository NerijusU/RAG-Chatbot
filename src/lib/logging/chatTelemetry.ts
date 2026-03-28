/**
 * Emits a single JSON log line for chat pipeline telemetry without user message content.
 *
 * @param event - Short event name, e.g. chat_ok or chat_error.
 * @param fields - Numeric or boolean metadata (lengths, counts, durations).
 * @returns Nothing.
 */
export function logChatTelemetry(event: string, fields: Record<string, string | number | boolean>): void {
  console.info(
    JSON.stringify({
      event,
      t: Date.now(),
      ...fields,
    }),
  );
}
