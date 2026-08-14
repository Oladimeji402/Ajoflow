import { NextResponse } from "next/server";
import { reconcileStalePendingPayments } from "@/lib/payments";
import { isCronAuthorized } from "@/lib/api/cron-auth";

export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await reconcileStalePendingPayments({ limit: 50 });
    return NextResponse.json({
      data: result,
    });
  } catch (error) {
    console.error("[payments/reconcile] Unexpected error:", error);
    return NextResponse.json({ error: "Failed to reconcile pending payments." }, { status: 500 });
  }
}
