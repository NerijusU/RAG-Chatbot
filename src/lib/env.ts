/**
 * Reads a required environment variable from process.env.
 *
 * @param name - Environment variable key to read.
 * @returns The environment variable value as a non-empty string.
 * @throws Error when the variable is missing or empty.
 */
export function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}
