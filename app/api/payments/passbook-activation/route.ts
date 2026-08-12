import { NextResponse } from "next/server";
import { badRequestResponse, requireUser, serverErrorResponse } from "@/lib/api/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { attributeMarketerOnPassbookActivation } from "@/lib/referrals/attribute-marketer";

const DEFAULT_PASSBOOK_FEE_NGN = 500;
const SETTINGS_KEY = "passbook_activation_fee";

function generateReference() {
  const randomPart = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `PB-ACTIVATE-${Date.now()}-${randomPart}`;
}

function generateRequestId() {
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `REQ-PASSBOOK-${Date.now()}-${randomPart}`;
}

function parseFeeValue(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) return value;
  if (typeof value === "string" && value.trim()) {
    const n = Number(value);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return DEFAULT_PASSBOOK_FEE_NGN;
}

async function getPassbookFee(adminSupabase: ReturnType<typeof createSupabaseAdminClient>) {
  const { data, error } = await adminSupabase
    .from("platform_settings")
    .select("value")
    .eq("key", SETTINGS_KEY)
    .maybeSingle();

  if (error) {
    console.error("Passbook fee lookup failed:", error.message);
    return DEFAULT_PASSBOOK_FEE_NGN;
  }

  return data ? parseFeeValue(data.value) : DEFAULT_PASSBOOK_FEE_NGN;
}

/** GET — current passbook activation fee for the activate UI */
export async function GET() {
  try {
    const auth = await requireUser();
    if (auth.error || !auth.user) return auth.error!;

    const adminSupabase = createSupabaseAdminClient();
    const amount = await getPassbookFee(adminSupabase);

    return NextResponse.json({ data: { amount } });
  } catch (error) {
    return serverErrorResponse(error);
  }
}

export async function POST() {
  try {
    const auth = await requireUser();
    if (auth.error || !auth.user) return auth.error!;

    // 1. Already activated — never charge again.
    const { data: profile, error: profileError } = await auth.supabase
      .from("profiles")
      .select("passbook_activated")
      .eq("id", auth.user.id)
      .maybeSingle();

    if (profileError) return serverErrorResponse(profileError);

    if (profile?.passbook_activated) {
      return NextResponse.json({ error: "Passbook already activated." }, { status: 409 });
    }

    const adminSupabase = createSupabaseAdminClient();
    const feeAmount = await getPassbookFee(adminSupabase);

    // Activate immediately using wallet balance (no Paystack).
    const reference = generateReference();
    const requestId = generateRequestId();
    const { data: activationStatus, error: activationError } = await adminSupabase.rpc("activate_passbook_from_wallet", {
      p_user_id: auth.user.id,
      p_reference: reference,
      p_request_id: requestId,
    });
    if (activationError) return serverErrorResponse(activationError);

    const status = String(activationStatus ?? "");
    if (status === "already_active") {
      return NextResponse.json({ error: "Passbook already activated." }, { status: 409 });
    }
    if (status === "insufficient_balance") {
      return NextResponse.json({
        error: `Insufficient wallet balance. You need at least NGN ${feeAmount.toLocaleString("en-NG")} to activate passbook.`,
      }, { status: 422 });
    }
    if (status !== "activated") {
      return badRequestResponse("Could not activate passbook from wallet.");
    }

    // Prefer the amount actually charged (in case fee changed mid-request).
    const { data: payment } = await adminSupabase
      .from("payment_records")
      .select("amount")
      .eq("reference", reference)
      .maybeSingle();
    const chargedAmount = payment?.amount != null ? Number(payment.amount) : feeAmount;

    void attributeMarketerOnPassbookActivation(auth.user.id).catch(() => {});

    await auth.supabase.from("notifications").insert({
      user_id: auth.user.id,
      type: "passbook_activated",
      title: "Passbook activated!",
      body: `Your one-time NGN ${chargedAmount.toLocaleString("en-NG")} passbook activation fee was debited from wallet successfully.`,
      metadata: { reference, amount: chargedAmount, provider: "wallet" },
    });

    return NextResponse.json({
      data: {
        amount: chargedAmount,
        reference,
        requestId,
        status: "success",
      },
    });
  } catch (error) {
    return serverErrorResponse(error);
  }
}
