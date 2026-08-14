import { NextResponse } from "next/server";
import { requireUser, serverErrorResponse } from "@/lib/api/auth";

export async function GET() {
  try {
    const auth = await requireUser();
    if (auth.error) return auth.error;
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (error) {
    return serverErrorResponse(error);
  }
}
