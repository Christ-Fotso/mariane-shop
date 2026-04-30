/**
 * Simple in-memory rate limiter.
 * Suitable for a single-server VPS deployment.
 * For multi-instance deployments, replace with Redis-backed solution.
 */

interface RateLimitEntry {
  count: number;
  firstAttemptAt: number;
}

const store = new Map<string, RateLimitEntry>();

const WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const MAX_REQUESTS = 20; // max login attempts per window

export function checkRateLimit(identifier: string): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || now - entry.firstAttemptAt > WINDOW_MS) {
    // First request or window expired
    store.set(identifier, { count: 1, firstAttemptAt: now });
    return { allowed: true };
  }

  if (entry.count >= MAX_REQUESTS) {
    const retryAfterMs = WINDOW_MS - (now - entry.firstAttemptAt);
    return { allowed: false, retryAfterMs };
  }

  entry.count++;
  return { allowed: true };
}
