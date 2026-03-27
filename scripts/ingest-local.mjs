import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Loads key-value pairs from a .env-style file.
 *
 * @param filePath - Absolute path to the env file.
 * @returns Parsed environment variables as string values.
 */
async function loadEnvFile(filePath) {
  const content = await readFile(filePath, "utf8");
  const result = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex <= 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    const unquoted =
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
        ? value.slice(1, -1)
        : value;

    result[key] = unquoted;
  }

  return result;
}

/**
 * Reads ingestion config from process env and local .env.local.
 *
 * @returns Ingestion endpoint URL and API key needed for authorization.
 */
async function getIngestConfig() {
  const projectRoot = process.cwd();
  const envFilePath = path.resolve(projectRoot, ".env.local");
  const fileEnv = await loadEnvFile(envFilePath).catch(() => ({}));
  const ingestApiKey = process.env.INGEST_API_KEY ?? fileEnv.INGEST_API_KEY;
  const ingestUrl =
    process.env.INGEST_URL ??
    fileEnv.INGEST_URL ??
    "http://localhost:3000/api/rag/ingest";

  if (!ingestApiKey) {
    throw new Error("Missing INGEST_API_KEY in process env or .env.local");
  }

  return {
    ingestApiKey,
    ingestUrl,
  };
}

/**
 * Parses optional JSON payload from CLI arg #1.
 *
 * @returns Parsed payload object used by the ingest API call.
 */
function getPayloadFromArgs() {
  const jsonArg = process.argv[2];
  if (!jsonArg) {
    return {};
  }

  try {
    return JSON.parse(jsonArg);
  } catch {
    throw new Error(
      'Invalid JSON argument. Example: pnpm ingest:local \'{"replaceExisting":true}\'',
    );
  }
}

/**
 * Executes local ingestion by calling the secured ingest API endpoint.
 *
 * @returns Promise that resolves when ingestion finishes or throws on failure.
 */
async function run() {
  const { ingestApiKey, ingestUrl } = await getIngestConfig();
  const payload = getPayloadFromArgs();

  let response;
  try {
    response = await fetch(ingestUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${ingestApiKey}`,
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      `Could not reach ${ingestUrl}. Start your app server or set INGEST_URL to a reachable deployment URL.`,
    );
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      `Ingest failed (${response.status}): ${JSON.stringify(data)}`,
    );
  }

  console.log("Ingest succeeded:");
  console.log(JSON.stringify(data, null, 2));
}

run().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
