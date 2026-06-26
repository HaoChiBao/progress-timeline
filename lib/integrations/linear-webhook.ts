import { createHmac, timingSafeEqual } from "crypto";
import type { TimelineTick } from "@/lib/timeline/event-catalog";

export type LinearWebhookPayload = {
  action: string;
  type: string;
  webhookTimestamp: number;
  data: {
    id: string;
    title?: string;
    identifier?: string;
    url?: string;
    state?: { name?: string; type?: string };
    updatedAt?: string;
    createdAt?: string;
  };
};

export function verifyLinearSignature(
  rawBody: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function linearIssueToTick(
  payload: LinearWebhookPayload,
  projectId: string
): TimelineTick | null {
  if (payload.type !== "Issue") return null;

  const { action, data } = payload;
  const now = new Date().toISOString();
  const note = data.identifier
    ? `${data.identifier}${data.title ? `: ${data.title}` : ""}`
    : data.title;

  let eventType: string;
  if (action === "create") {
    eventType = "linear.ticket_created";
  } else if (
    action === "update" &&
    (data.state?.type === "completed" ||
      data.state?.name?.toLowerCase().includes("done"))
  ) {
    eventType = "linear.ticket_completed";
  } else if (action === "update") {
    eventType = "linear.ticket_updated";
  } else {
    return null;
  }

  return {
    id: `linear_${data.id}_${payload.webhookTimestamp}`,
    projectId,
    source: "linear",
    eventType,
    note,
    occurredAt: data.updatedAt ?? data.createdAt ?? now,
    createdAt: now,
  };
}
