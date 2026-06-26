import type { TimelineTick } from "@/lib/timeline/event-catalog";
import { getEventTypeLabel, getSourceColor } from "@/lib/timeline/event-catalog";

export type AsciiTick = {
  id: string;
  char: "|";
  color: string;
  title: string;
};

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ticksToAsciiLine(ticks: TimelineTick[]): AsciiTick[] {
  const sorted = [...ticks].sort(
    (a, b) =>
      new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime()
  );

  return sorted.map((tick) => ({
    id: tick.id,
    char: "|",
    color: getSourceColor(tick.source),
    title: [
      getEventTypeLabel(tick.source, tick.eventType),
      formatWhen(tick.occurredAt),
      tick.note,
    ]
      .filter(Boolean)
      .join(" · "),
  }));
}
