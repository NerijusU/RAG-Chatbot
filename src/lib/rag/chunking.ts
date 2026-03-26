/**
 * Splits text into overlapping chunks by character count.
 *
 * @param text - Source text to split.
 * @param chunkSize - Maximum characters per chunk.
 * @param chunkOverlap - Characters to overlap between chunks.
 * @returns Ordered text chunks for embedding and retrieval.
 */
export function splitTextIntoChunks(
  text: string,
  chunkSize: number,
  chunkOverlap: number,
): string[] {
  const normalizedText = text.trim();
  if (!normalizedText) {
    return [];
  }

  const chunks: string[] = [];
  let start = 0;

  while (start < normalizedText.length) {
    const end = Math.min(start + chunkSize, normalizedText.length);
    const chunk = normalizedText.slice(start, end).trim();

    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    if (end === normalizedText.length) {
      break;
    }

    start = Math.max(end - chunkOverlap, start + 1);
  }

  return chunks;
}
