import { NextResponse } from "next/server";

/** Legacy group-contribution payment init — product is individual savings only. */
export async function POST() {
  return NextResponse.json(
    { error: "Group savings is no longer available" },
    { status: 410 },
  );
}
