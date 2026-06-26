import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Liveblocks auth not configured",
      message: "Set LIVEBLOCKS_SECRET_KEY to enable collaborative rooms.",
    },
    { status: 501 }
  );
}
