import type { TimelineTick } from "@/lib/timeline/event-catalog";

/** Merge manual (localStorage) and automatic (server/webhook) ticks. */
export function mergeTicks(
  local: TimelineTick[],
  server: TimelineTick[]
): TimelineTick[] {
  const byId = new Map<string, TimelineTick>();
  for (const tick of [...local, ...server]) {
    byId.set(tick.id, tick);
  }
  return [...byId.values()].sort(
    (a, b) =>
      new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime()
  );
}

export async function fetchServerTicks(
  projectId: string
): Promise<TimelineTick[]> {
  try {
    const res = await fetch(`/api/timeline/${projectId}`);
    if (!res.ok) return [];
    const data = (await res.json()) as { ticks: TimelineTick[] };
    return data.ticks ?? [];
  } catch {
    return [];
  }
}
