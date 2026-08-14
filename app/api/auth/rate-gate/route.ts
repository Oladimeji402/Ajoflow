import { NextResponse } from "next/server";
import {
  RATE_LIMITS,
  enforceRateLimit,
  getClientIp,
  rateLimitResponse,
} from "@/lib/rate-limit";

/**
 * Lightweight gate for client-side Supabase auth (login/signup).
 * Call before signIn/signUp to throttle credential stuffing by IP.
 */
export async function POST(request: Request) {
  const ip = getClientIp(request);
  let action = "auth";
  try {
    const body = await request.json().catch(() => ({}));
    if (typeof body.action === "string" && body.action.trim()) {
      action = body.action.trim().toLowerCase().slice(0, 32);
    }
  } catch {
    // ignore
  }

  const result = await enforceRateLimit(`auth:${action}:${ip}`, RATE_LIMITS.authGate);
  if (!result.ok) return rateLimitResponse(result.retryAfterSeconds);

  return NextResponse.json({ ok: true, remaining: result.remaining });
}
