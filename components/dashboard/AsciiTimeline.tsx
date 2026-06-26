"use client";

import type { TimelineTick } from "@/lib/timeline/event-catalog";
import { ticksToAsciiLine } from "@/lib/timeline/ascii-timeline";
import {
  formatSpanLabel,
  getTimelineSpan,
} from "@/lib/timeline/timeline-span";
import type { TimelineVisualMode } from "@/components/dashboard/TimelineDock";
import { cn } from "@/lib/utils";
import { useCallback, useMemo, useRef, useState } from "react";

type AsciiTimelineProps = {
  ticks: TimelineTick[];
  projectName: string;
  visualMode: TimelineVisualMode;
  onStartAdd: () => void;
  allowAdd?: boolean;
  isActive?: boolean;
  onSelect?: () => void;
  centered?: boolean;
};

export function AsciiTimeline({
  ticks,
  projectName,
  visualMode,
  onStartAdd,
  allowAdd = true,
  isActive = false,
  onSelect,
  centered = false,
}: AsciiTimelineProps) {
  const line = useMemo(() => ticksToAsciiLine(ticks), [ticks]);
  const span = useMemo(() => getTimelineSpan(ticks), [ticks]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [railHovered, setRailHovered] = useState(false);
  const tickRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const clearHoverRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showBars = visualMode === "bars" || visualMode === "reveal";
  const showLettersAlways = visualMode === "letters";

  const pickTickAt = useCallback(
    (clientX: number) => {
      if (line.length === 0) return null;

      let bestId = line[0]!.id;
      let bestDist = Infinity;

      for (const tick of line) {
        const el = tickRefs.current.get(tick.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        const dist = Math.abs(clientX - center);
        if (dist < bestDist) {
          bestDist = dist;
          bestId = tick.id;
        }
      }

      return bestId;
    },
    [line]
  );

  const handleRailPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (clearHoverRef.current) {
        clearTimeout(clearHoverRef.current);
        clearHoverRef.current = null;
      }
      const id = pickTickAt(e.clientX);
      setActiveId(id);
    },
    [pickTickAt]
  );

  const handleRailPointerLeave = useCallback(() => {
    clearHoverRef.current = setTimeout(() => {
      setActiveId(null);
      setRailHovered(false);
    }, 80);
  }, []);

  const handleRailPointerEnter = useCallback(() => {
    if (clearHoverRef.current) {
      clearTimeout(clearHoverRef.current);
      clearHoverRef.current = null;
    }
    setRailHovered(true);
  }, []);

  return (
    <section
      className={cn(
        "group flex w-full flex-col",
        centered
          ? "items-center text-center"
          : isActive
            ? "border-l-2 border-ink pl-4"
            : "pl-6"
      )}
      aria-label={`${projectName} timeline`}
    >
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "mb-2 min-h-9 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
          centered ? "text-center" : "text-left",
          isActive ? "text-ink" : "text-muted-text"
        )}
      >
        {isActive ? "> " : "  "}
        {projectName}
      </button>

      {span && (
        <p
          className={cn(
            "mb-3 text-xs text-muted-soft",
            centered && "text-center"
          )}
          role="status"
        >
          {formatSpanLabel(span)}
        </p>
      )}

      <div
        className={cn(
          "timeline-scroll relative w-full overflow-x-auto pb-2",
          centered ? "max-w-[min(100%,56rem)]" : "max-w-full"
        )}
        onPointerEnter={handleRailPointerEnter}
        onPointerMove={handleRailPointerMove}
        onPointerLeave={handleRailPointerLeave}
      >
        <div
          className={cn(
            "flex min-w-min flex-nowrap items-end gap-0 px-1",
            centered && "justify-center"
          )}
          role="list"
          aria-label={`${ticks.length} events, oldest to newest left to right`}
        >
          {line.length === 0 ? (
            <span className="px-2 py-4 text-muted-soft" aria-hidden>
              ·
            </span>
          ) : (
            line.map((tick) => {
              const isActiveTick = activeId === tick.id;
              const expanded =
                showLettersAlways || (visualMode === "reveal" && isActiveTick);
              const glyph = expanded ? tick.letter : tick.bar;

              return (
                <div
                  key={tick.id}
                  className="relative flex flex-col items-center self-end"
                >
                  {isActiveTick && (
                    <div
                      className="timeline-tick-tooltip pointer-events-none absolute bottom-full z-10 mb-2 max-w-48 whitespace-nowrap rounded border border-hairline bg-canvas px-2 py-1 text-[10px] text-muted-text shadow-subtle"
                      role="tooltip"
                    >
                      {tick.title}
                    </div>
                  )}
                  <button
                    type="button"
                    role="listitem"
                    ref={(el) => {
                      if (el) tickRefs.current.set(tick.id, el);
                      else tickRefs.current.delete(tick.id);
                    }}
                    style={{ color: tick.color }}
                    title={tick.title}
                    aria-label={tick.ariaLabel}
                    onFocus={() => setActiveId(tick.id)}
                    onBlur={() => setActiveId(null)}
                    className={cn(
                      "timeline-tick flex items-end justify-center font-bold leading-none",
                      showBars && !expanded && "timeline-tick--bar",
                      expanded && "timeline-tick--expanded",
                      isActiveTick && "timeline-tick--active"
                    )}
                  >
                    {glyph}
                  </button>
                </div>
              );
            })
          )}

          {allowAdd && (railHovered || line.length === 0) && (
            <div className="relative ml-1 flex flex-col items-center self-end">
              <button
                type="button"
                onClick={onStartAdd}
                className="timeline-tick timeline-tick--add flex items-end justify-center px-1 text-muted-soft hover:text-ink focus-visible:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                aria-label={`Add tick to ${projectName}`}
              >
                [+]
              </button>
            </div>
          )}
        </div>
      </div>

      {line.length > 0 && visualMode === "reveal" && (
        <p
          className={cn(
            "mt-1 text-[10px] text-muted-soft",
            centered && "text-center"
          )}
          aria-hidden
        >
          ← older · newer → · hover to reveal sources
        </p>
      )}
      {line.length > 0 && visualMode === "bars" && (
        <p
          className={cn(
            "mt-1 text-[10px] text-muted-soft",
            centered && "text-center"
          )}
          aria-hidden
        >
          ← older · newer →
        </p>
      )}
    </section>
  );
}
