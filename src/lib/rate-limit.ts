import {
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS,
} from '@/lib/constants';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store — works within a single server process / serverless
// invocation lifetime. For multi-instance deployments swap with Redis.
const store = new Map<string, RateLimitEntry>();

/**
 * Check (and increment) the rate limit for a given identifier.
 *
 * @param identifier  Unique key (e.g. hashed IP or fingerprint)
 * @param maxRequests Maximum requests allowed in the window (default from constants)
 * @param windowMs   Window duration in milliseconds (default from constants)
 * @returns           Whether the request is allowed, remaining quota, and ms until reset
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number = RATE_LIMIT_MAX_REQUESTS,
  windowMs: number = RATE_LIMIT_WINDOW_MS
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();

  // Housekeeping — purge expired entries to avoid unbounded memory growth
  store.forEach((entry, key) => {
    if (now >= entry.resetTime) {
      store.delete(key);
    }
  });

  const existing = store.get(identifier);

  // First request or window expired → start fresh
  if (!existing || now >= existing.resetTime) {
    store.set(identifier, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs };
  }

  // Within window — check quota
  existing.count += 1;
  const remaining = Math.max(0, maxRequests - existing.count);
  const resetIn = existing.resetTime - now;

  if (existing.count > maxRequests) {
    return { allowed: false, remaining: 0, resetIn };
  }

  return { allowed: true, remaining, resetIn };
}
