import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

type LimitConfig = {
  /** Max requests in the window */
  limit: number;
  /** Window length in seconds */
  windowSeconds: number;
};

type RateLimitResult =
  | { ok: true; remaining: number; reset: number }
  | { ok: false; remaining: number; reset: number; retryAfterSeconds: number };

const memoryBuckets = new Map<string, { count: number; resetAt: number }>();

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

const limiterCache = new Map<string, Ratelimit>();

function getUpstashLimiter(prefix: string, config: LimitConfig): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;

  const cacheKey = `${prefix}:${config.limit}:${config.windowSeconds}`;
  const existing = limiterCache.get(cacheKey);
  if (existing) return existing;

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.limit, `${config.windowSeconds} s`),
    prefix: `ajoflow:${prefix}`,
    analytics: false,
  });
  limiterCache.set(cacheKey, limiter);
  return limiter;
}

function checkMemory(key: string, config: LimitConfig): RateLimitResult {
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  const current = memoryBuckets.get(key);

  if (!current || current.resetAt <= now) {
    const resetAt = now + windowMs;
    memoryBuckets.set(key, { count: 1, resetAt });
    return { ok: true, remaining: config.limit - 1, reset: resetAt };
  }

  if (current.count >= config.limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    return {
      ok: false,
      remaining: 0,
      reset: current.resetAt,
      retryAfterSeconds,
    };
  }

  current.count += 1;
  memoryBuckets.set(key, current);
  return {
    ok: true,
    remaining: Math.max(0, config.limit - current.count),
    reset: current.resetAt,
  };
}

/** Sliding-window rate limit. Uses Upstash when configured; otherwise in-memory (per instance). */
export async function enforceRateLimit(
  key: string,
  config: LimitConfig,
): Promise<RateLimitResult> {
  const limiter = getUpstashLimiter(key.split(":")[0] ?? "default", config);

  if (limiter) {
    const result = await limiter.limit(key);
    if (result.success) {
      return { ok: true, remaining: result.remaining, reset: result.reset };
    }
    const retryAfterSeconds = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));
    return {
      ok: false,
      remaining: result.remaining,
      reset: result.reset,
      retryAfterSeconds,
    };
  }

  return checkMemory(key, config);
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export function rateLimitResponse(retryAfterSeconds: number) {
  return NextResponse.json(
    {
      error: "Too many requests. Please try again shortly.",
      code: "RATE_LIMIT_EXCEEDED",
      retryAfterSeconds,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSeconds),
      },
    },
  );
}

/** Presets for money / auth sensitive routes */
export const RATE_LIMITS = {
  walletCheck: { limit: 10, windowSeconds: 60 },
  provisionVa: { limit: 5, windowSeconds: 60 },
  moneySpend: { limit: 15, windowSeconds: 60 },
  authGate: { limit: 20, windowSeconds: 60 },
  adminLoginAttempt: { limit: 30, windowSeconds: 60 },
} as const;
