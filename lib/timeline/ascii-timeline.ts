import type { TimelineTick } from "@/lib/timeline/event-catalog";
import {
  getEventTypeLabel,
  getSourceColor,
  getSourcePrefix,
  tickAriaLabel,
} from "@/lib/timeline/event-catalog";

export type AsciiTick = {
  id: string;
  /** Compact bar character. */
  bar: "|";
  /** Source letter for expanded / letters mode. */
  letter: string;
  color: string;
  title: string;
  ariaLabel: string;
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
    bar: "|",
    letter: getSourcePrefix(tick.source),
    color: getSourceColor(tick.source),
    title: [
      getEventTypeLabel(tick.source, tick.eventType),
      formatWhen(tick.occurredAt),
      tick.note,
      tick.tags?.length ? `#${tick.tags.join(" #")}` : undefined,
    ]
      .filter(Boolean)
      .join(" · "),
    ariaLabel: tickAriaLabel(tick),
  }));
}
