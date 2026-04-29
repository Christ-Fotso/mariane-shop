/**
 * Secret Loader — Docker Secrets support
 *
 * In production (Docker), each secret is stored as a file in /run/secrets/<SECRET_NAME>.
 * This utility reads from the file if it exists, and falls back to environment variables
 * for local development.
 *
 * Usage:
 *   const dbUrl = readSecret('DATABASE_URL');
 */
import { readFileSync } from 'fs';

const SECRETS_DIR = '/run/secrets';

export function readSecret(name: string): string {
  // Try to read from Docker secret file first
  const secretPath = `${SECRETS_DIR}/${name}`;
  try {
    return readFileSync(secretPath, 'utf-8').trim();
  } catch {
    // Fall back to environment variable (for local dev)
    const envValue = process.env[name];
    if (!envValue) {
      throw new Error(
        `Secret "${name}" not found. ` +
          `Expected either a file at ${secretPath} or an environment variable ${name}.`
      );
    }
    return envValue;
  }
}
