import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Linear webhook not configured",
      message: "Integration scaffold only — webhook handler coming in a later ticket.",
    },
    { status: 501 }
  );
}
