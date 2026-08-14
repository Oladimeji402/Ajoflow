import { NextResponse } from "next/server";
import { requireUser, serverErrorResponse } from "@/lib/api/auth";

/** Legacy group contributions retired. */
export async function GET() {
  try {
    const auth = await requireUser();
    if (auth.error) return auth.error;
    return NextResponse.json({ data: [] });
  } catch (error) {
    return serverErrorResponse(error);
  }
}
