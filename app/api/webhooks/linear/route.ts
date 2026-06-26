import {
  linearIssueToTick,
  verifyLinearSignature,
  type LinearWebhookPayload,
} from "@/lib/integrations/linear-webhook";
import { appendServerTick } from "@/lib/timeline/server-tick-store";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secret = process.env.LINEAR_WEBHOOK_SECRET;
  const projectId =
    process.env.LINEAR_DEFAULT_PROJECT_ID ?? "proj_progress_goat";

  if (!secret) {
    return NextResponse.json(
      {
        error: "Linear webhook not configured",
        message:
          "Set LINEAR_WEBHOOK_SECRET in .env.local — create a webhook in Linear → Settings → API → Webhooks.",
      },
      { status: 501 }
    );
  }

  const rawBody = await request.text();
  const signature = request.headers.get("linear-signature");

  if (!verifyLinearSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: LinearWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as LinearWebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const age = Date.now() - payload.webhookTimestamp;
  if (age > 60_000) {
    return NextResponse.json({ error: "Webhook expired" }, { status: 400 });
  }

  const tick = linearIssueToTick(payload, projectId);
  if (tick) {
    appendServerTick(tick);
  }

  return NextResponse.json({ received: true, tick: tick?.id ?? null });
}
