"use client";

import type { TimelineTick } from "@/lib/timeline/event-catalog";
import { ticksToAsciiLine } from "@/lib/timeline/ascii-timeline";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

type AsciiTimelineProps = {
  ticks: TimelineTick[];
  projectName: string;
  onStartAdd: () => void;
  allowAdd?: boolean;
  isActive?: boolean;
  onSelect?: () => void;
  /** Center timeline block in the viewport middle. */
  centered?: boolean;
};

export function AsciiTimeline({
  ticks,
  projectName,
  onStartAdd,
  allowAdd = true,
  isActive = false,
  onSelect,
  centered = false,
}: AsciiTimelineProps) {
  const line = useMemo(() => ticksToAsciiLine(ticks), [ticks]);
  const [hovered, setHovered] = useState(false);

  return (
    <section
      className={cn(
        "flex w-full flex-col",
        centered
          ? "items-center text-center"
          : isActive
            ? "border-l-2 border-ink pl-4"
            : "pl-6"
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "mb-3 hover:text-ink",
          centered ? "text-center" : "text-left",
          isActive ? "text-ink" : "text-muted-text"
        )}
      >
        {isActive ? "> " : "  "}
        {projectName}
      </button>

      <div
        className={cn(
          "flex w-full flex-wrap items-center text-lg leading-none",
          centered ? "justify-center" : "justify-start"
        )}
        aria-label={`${projectName} timeline`}
      >
        {line.length === 0 ? (
          <span className="text-muted-soft">|</span>
        ) : (
          line.map((tick) => (
            <span
              key={tick.id}
              style={{ color: tick.color }}
              title={tick.title}
              className="cursor-default"
            >
              {tick.char}
            </span>
          ))
        )}

        {allowAdd && hovered && (
          <button
            type="button"
            onClick={onStartAdd}
            className="ml-1 text-muted-soft transition-opacity hover:text-ink"
            aria-label={`Add tick to ${projectName}`}
          >
            [+]
          </button>
        )}
      </div>
    </section>
  );
}
