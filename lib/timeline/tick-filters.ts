import type { TimelineTick } from "@/lib/timeline/event-catalog";

export type TimeRange = "all" | "today" | "week";

export type TimelineFilterState = {
  timeRange: TimeRange;
  source: string | "all";
  tag: string;
  /** Hide low-signal updates like ticket_updated. */
  hideMinor: boolean;
};

export const DEFAULT_FILTERS: TimelineFilterState = {
  timeRange: "all",
  source: "all",
  tag: "",
  hideMinor: false,
};

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function inTimeRange(iso: string, range: TimeRange): boolean {
  if (range === "all") return true;
  const t = new Date(iso).getTime();
  const now = Date.now();
  if (range === "today") {
    return t >= startOfDay(new Date()).getTime();
  }
  const weekAgo = now - 7 * 86400000;
  return t >= weekAgo;
}

const MINOR_EVENT_TYPES = new Set([
  "linear.ticket_updated",
  "notion.page_updated",
  "figma.file_updated",
]);

export function filterTicks(
  ticks: TimelineTick[],
  filters: TimelineFilterState
): TimelineTick[] {
  const tagQuery = filters.tag.replace(/^#/, "").trim().toLowerCase();

  return ticks.filter((tick) => {
    if (!inTimeRange(tick.occurredAt, filters.timeRange)) return false;
    if (filters.source !== "all" && tick.source !== filters.source) return false;
    if (filters.hideMinor && MINOR_EVENT_TYPES.has(tick.eventType)) return false;
    if (tagQuery) {
      const tags = tick.tags ?? [];
      const inTags = tags.some((t) => t.includes(tagQuery));
      const inNote = tick.note?.toLowerCase().includes(tagQuery);
      if (!inTags && !inNote) return false;
    }
    return true;
  });
}
