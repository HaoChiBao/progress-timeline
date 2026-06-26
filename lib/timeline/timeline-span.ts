import type { TimelineTick } from "@/lib/timeline/event-catalog";

export type TimelineSpan = {
  start: Date;
  end: Date;
  count: number;
  daySpan: number;
};

export function getTimelineSpan(ticks: TimelineTick[]): TimelineSpan | null {
  if (ticks.length === 0) return null;

  const sorted = [...ticks].sort(
    (a, b) =>
      new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime()
  );

  const start = new Date(sorted[0].occurredAt);
  const end = new Date(sorted[sorted.length - 1].occurredAt);
  const daySpan = Math.max(
    1,
    Math.ceil((end.getTime() - start.getTime()) / 86400000)
  );

  return { start, end, count: ticks.length, daySpan };
}

export function formatSpanLabel(span: TimelineSpan): string {
  const fmt = (d: Date) =>
    d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return `${fmt(span.start)} → ${fmt(span.end)} · ${span.count} events · ${span.daySpan}d`;
}
