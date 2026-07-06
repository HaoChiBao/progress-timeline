"use client";

import type { TimelineTick } from "@/lib/timeline/event-catalog";
import {
  getEventTypeLabel,
  getSourceColor,
  getSourcePrefix,
} from "@/lib/timeline/source-registry";
import { cn } from "@/lib/utils";

type AsciiTickDetailProps = {
  tick: TimelineTick;
  projectName: string;
  onClose: () => void;
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

function row(label: string, value: React.ReactNode) {
  return (
    <div className="grid grid-cols-[4.5rem_1fr] gap-x-2 gap-y-0.5 text-xs">
      <span className="text-muted-soft">{label}</span>
      <span className="min-w-0 text-ink">{value}</span>
    </div>
  );
}

export function AsciiTickDetail({
  tick,
  projectName,
  onClose,
}: AsciiTickDetailProps) {
  const prefix = getSourcePrefix(tick.source);
  const color = getSourceColor(tick.source);
  const typeLabel = getEventTypeLabel(tick.source, tick.eventType);

  return (
    <div
      role="dialog"
      aria-labelledby="ascii-tick-detail-title"
      className="ascii-panel w-full font-mono text-sm"
    >
      <div className="ascii-panel-header mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] text-muted-soft">{projectName}</p>
          <h2
            id="ascii-tick-detail-title"
            className="mt-1 flex items-center gap-2 text-ink"
          >
            <span style={{ color }} className="text-lg font-bold leading-none">
              {prefix}
            </span>
            <span className="truncate">{typeLabel}</span>
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 text-muted-soft hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          aria-label="Dismiss"
        >
          [×]
        </button>
      </div>

      <div className="ascii-panel-body space-y-2 border-t border-hairline pt-3">
        {row("when", formatWhen(tick.occurredAt))}
        {tick.note && row("note", <span className="whitespace-pre-wrap">{tick.note}</span>)}
        {tick.tags && tick.tags.length > 0 &&
          row(
            "tags",
            tick.tags.map((t) => `#${t}`).join(" ")
          )}
        {tick.externalUrl &&
          row(
            "link",
            <a
              href={tick.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-primary-hex underline-offset-2 hover:underline"
            >
              {tick.externalUrl}
            </a>
          )}
        {row("rec", formatWhen(tick.createdAt))}
        {row("id", <span className="text-[10px] text-muted-soft">{tick.id}</span>)}
      </div>

      <div className="ascii-panel-footer mt-4 border-t border-hairline pt-3">
        <button
          type="button"
          onClick={onClose}
          className={cn(
            "min-h-9 w-full border border-hairline px-3 py-2 text-xs text-muted-text",
            "hover:border-ink hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          )}
        >
          [ dismiss ]
        </button>
      </div>
    </div>
  );
}
