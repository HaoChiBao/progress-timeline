import { getServerTicks } from "@/lib/timeline/server-tick-store";
import { NextResponse } from "next/server";

type RouteParams = { params: Promise<{ projectId: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { projectId } = await params;
  const ticks = getServerTicks(projectId);
  return NextResponse.json({ ticks });
}
