"use client";

import type { TimelineTick } from "@/lib/timeline/event-catalog";
import {
  getEventTypeLabel,
  getSourceColor,
  getSourcePrefix,
  tickAriaLabel,
} from "@/lib/timeline/event-catalog";
import { cn } from "@/lib/utils";

type TimelineListViewProps = {
  ticks: TimelineTick[];
  projectName: string;
  className?: string;
};

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function TimelineListView({
  ticks,
  projectName,
  className,
}: TimelineListViewProps) {
  const sorted = [...ticks].sort(
    (a, b) =>
      new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime()
  );

  if (sorted.length === 0) {
    return (
      <p className={cn("text-center text-muted-soft", className)} role="status">
        No ticks match — press <kbd className="text-ink">n</kbd> to add one
      </p>
    );
  }

  return (
    <ol
      className={cn("w-full max-w-lg space-y-2 text-left text-sm", className)}
      aria-label={`${projectName} timeline events`}
    >
      {sorted.map((tick, index) => (
        <li
          key={tick.id}
          tabIndex={0}
          className="rounded-sm border border-transparent px-2 py-2 outline-none focus-visible:border-ink focus-visible:ring-1 focus-visible:ring-ink"
          aria-label={tickAriaLabel(tick)}
        >
          <div className="flex items-start gap-2">
            <span
              className="mt-0.5 inline-flex h-6 min-w-6 shrink-0 items-center justify-center text-xs font-bold"
              style={{ color: getSourceColor(tick.source) }}
              aria-hidden
            >
              {getSourcePrefix(tick.source)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <time
                  dateTime={tick.occurredAt}
                  className="text-xs text-muted-soft"
                >
                  {formatWhen(tick.occurredAt)}
                </time>
                <span className="text-ink">
                  {getEventTypeLabel(tick.source, tick.eventType)}
                </span>
              </div>
              {tick.note && (
                <p className="mt-0.5 text-muted-text">{tick.note}</p>
              )}
              {tick.tags && tick.tags.length > 0 && (
                <p className="mt-1 text-xs text-muted-soft">
                  {tick.tags.map((t) => `#${t}`).join(" ")}
                </p>
              )}
              {tick.externalUrl && (
                <a
                  href={tick.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-xs text-primary-hex underline-offset-2 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  open link
                </a>
              )}
            </div>
            <span className="text-xs text-muted-soft" aria-hidden>
              {index === 0
                ? "oldest"
                : index === sorted.length - 1
                  ? "newest"
                  : ""}
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}
