import type { TimelineTick } from "@/lib/timeline/event-catalog";
import {
  getEventTypeLabel,
  listAllSources,
  resolveSource,
} from "@/lib/timeline/source-registry";

function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/** Build a Markdown standup summary for ticks in the last 7 days. */
export function buildWeekSummary(
  ticks: TimelineTick[],
  projectName: string
): string {
  const weekAgo = Date.now() - 7 * 86400000;
  const recent = [...ticks]
    .filter((t) => new Date(t.occurredAt).getTime() >= weekAgo)
    .sort(
      (a, b) =>
        new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime()
    );

  if (recent.length === 0) {
    return `## ${projectName} — this week\n\nNo timeline ticks in the last 7 days.`;
  }

  const bySource = Object.fromEntries(
    listAllSources().map((s) => [s.id, 0])
  ) as Record<string, number>;
  for (const tick of recent) {
    bySource[tick.source] = (bySource[tick.source] ?? 0) + 1;
  }

  const sourceLine = Object.entries(bySource)
    .filter(([, n]) => n > 0)
    .map(([s, n]) => `${resolveSource(s).label}: ${n}`)
    .join(" · ");

  const lines = recent.map((tick) => {
    const label = getEventTypeLabel(tick.source, tick.eventType);
    const note = tick.note ? ` — ${tick.note}` : "";
    const tags = tick.tags?.length ? ` [${tick.tags.join(", ")}]` : "";
    return `- **${formatDay(tick.occurredAt)}** · ${label}${note}${tags}`;
  });

  return [
    `## ${projectName} — this week`,
    "",
    sourceLine,
    "",
    ...lines,
  ].join("\n");
}
