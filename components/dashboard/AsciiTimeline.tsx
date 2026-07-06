"use client";

import type { TimelineTick } from "@/lib/timeline/event-catalog";
import { ticksToAsciiLine } from "@/lib/timeline/ascii-timeline";
import {
  formatSpanLabel,
  getTimelineSpan,
} from "@/lib/timeline/timeline-span";
import type { TimelineVisualMode } from "@/components/dashboard/TimelineDock";
import { TimelineAddButton } from "@/components/dashboard/TimelineAddButton";
import { TimelineRail } from "@/components/dashboard/TimelineRail";
import { cn } from "@/lib/utils";
import { useCallback, useMemo, useRef, useState } from "react";

type AsciiTimelineProps = {
  ticks: TimelineTick[];
  projectName: string;
  visualMode: TimelineVisualMode;
  onStartAdd: () => void;
  selectedTickId?: string | null;
  onSelectTick?: (tickId: string) => void;
  allowAdd?: boolean;
  isActive?: boolean;
  onSelect?: () => void;
  centered?: boolean;
  hideProjectHeader?: boolean;
};

export function AsciiTimeline({
  ticks,
  projectName,
  visualMode,
  onStartAdd,
  selectedTickId = null,
  onSelectTick,
  allowAdd = true,
  isActive = false,
  onSelect,
  centered = false,
  hideProjectHeader = false,
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

  const handleStagePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (clearHoverRef.current) {
        clearTimeout(clearHoverRef.current);
        clearHoverRef.current = null;
      }
      setActiveId(pickTickAt(e.clientX));
    },
    [pickTickAt]
  );

  const handleStagePointerLeave = useCallback(() => {
    clearHoverRef.current = setTimeout(() => {
      setActiveId(null);
      setRailHovered(false);
    }, 80);
  }, []);

  const handleStagePointerEnter = useCallback(() => {
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
      {!hideProjectHeader && (
        <>
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
        </>
      )}

      <div
        className={cn(
          "timeline-stage relative w-full",
          centered ? "max-w-[min(100%,56rem)]" : "max-w-full"
        )}
        onPointerEnter={handleStagePointerEnter}
        onPointerMove={handleStagePointerMove}
        onPointerLeave={handleStagePointerLeave}
      >
        <TimelineRail
          line={line}
          visualMode={visualMode}
          showBars={showBars}
          showLettersAlways={showLettersAlways}
          activeId={activeId}
          selectedTickId={selectedTickId}
          onActiveChange={setActiveId}
          onTickSelect={(id) => onSelectTick?.(id)}
          tickRefs={tickRefs}
          centered={centered}
          eventCount={ticks.length}
        />

        {allowAdd && (
          <TimelineAddButton
            projectName={projectName}
            railHovered={railHovered}
            onStartAdd={onStartAdd}
          />
        )}
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
