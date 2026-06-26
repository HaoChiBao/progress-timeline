"use client";

import { SourceBadge } from "@/components/tickets/SourceBadge";
import type { ProjectEvent } from "@/lib/types/event";
import { cn } from "@/lib/utils";
import { useState } from "react";

type TimelineEventMarkerProps = {
  event: ProjectEvent;
  x: number;
  index: number;
};

function formatEventTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function TimelineEventMarker({ event, x, index }: TimelineEventMarkerProps) {
  const [hovered, setHovered] = useState(false);
  const sticksUp = index % 2 === 0;

  return (
    <div
      className="absolute z-20 -translate-x-1/2"
      style={{ left: x, bottom: "var(--grass-horizon)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {sticksUp ? (
        <div className="flex flex-col items-center">
          <div
            className={cn(
              "mb-2 w-[240px] rounded-lg border border-hairline bg-surface-card px-3 py-2.5 shadow-subtle transition-all duration-200",
              hovered
                ? "translate-y-0 opacity-100"
                : "translate-y-1 opacity-0"
            )}
          >
            <EventCardContent event={event} />
          </div>
          <div
            className={cn(
              "w-px bg-[#556246] transition-all duration-200",
              hovered ? "h-14" : "h-10"
            )}
          />
          <div
            className={cn(
              "rounded-full border-2 border-[#faf9f5] bg-[#6f7c5d] transition-all duration-200",
              hovered ? "size-3.5" : "size-2.5"
            )}
          />
        </div>
      ) : (
        <div className="flex flex-col-reverse items-center">
          <div
            className={cn(
              "mt-2 w-[240px] rounded-lg border border-hairline bg-surface-card px-3 py-2.5 shadow-subtle transition-all duration-200",
              hovered
                ? "translate-y-0 opacity-100"
                : "-translate-y-1 opacity-0"
            )}
          >
            <EventCardContent event={event} />
          </div>
          <div
            className={cn(
              "w-px bg-[#556246] transition-all duration-200",
              hovered ? "h-14" : "h-10"
            )}
          />
          <div
            className={cn(
              "rounded-full border-2 border-[#faf9f5] bg-[#6f7c5d] transition-all duration-200",
              hovered ? "size-3.5" : "size-2.5"
            )}
          />
        </div>
      )}
    </div>
  );
}

function EventCardContent({ event }: { event: ProjectEvent }) {
  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <time className="text-xs text-muted-soft">
          {formatEventTime(event.occurredAt)}
        </time>
        <SourceBadge source={event.source} className="scale-90" />
      </div>
      <p className="mt-1.5 text-sm font-medium leading-snug text-ink">
        {event.title}
      </p>
      {event.summary && (
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-text">
          {event.summary}
        </p>
      )}
    </>
  );
}
