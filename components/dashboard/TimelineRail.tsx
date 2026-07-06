"use client";

import type { AsciiTick } from "@/lib/timeline/ascii-timeline";
import type { TimelineVisualMode } from "@/components/dashboard/TimelineDock";
import { cn } from "@/lib/utils";

type TimelineRailProps = {
  line: AsciiTick[];
  visualMode: TimelineVisualMode;
  showBars: boolean;
  showLettersAlways: boolean;
  activeId: string | null;
  selectedTickId: string | null;
  onActiveChange: (id: string | null) => void;
  onTickSelect: (id: string) => void;
  tickRefs: React.MutableRefObject<Map<string, HTMLButtonElement>>;
  centered?: boolean;
  eventCount: number;
};

export function TimelineRail({
  line,
  visualMode,
  showBars,
  showLettersAlways,
  activeId,
  selectedTickId,
  onActiveChange,
  onTickSelect,
  tickRefs,
  centered = false,
  eventCount,
}: TimelineRailProps) {
  return (
    <div className="timeline-scroll w-full overflow-x-auto pb-2">
      <div
        className={cn(
          "flex min-w-min flex-nowrap items-end justify-center gap-0 px-1",
          centered && "mx-auto"
        )}
        role="list"
        aria-label={`${eventCount} events, oldest to newest left to right`}
      >
        {line.length === 0 ? (
          <span className="timeline-tick flex items-end justify-center px-2 text-muted-soft" aria-hidden>
            ·
          </span>
        ) : (
          line.map((tick) => {
            const isActiveTick = activeId === tick.id && selectedTickId !== tick.id;
            const isSelected = selectedTickId === tick.id;
            const expanded =
              showLettersAlways ||
              isSelected ||
              (visualMode === "reveal" && isActiveTick);
            const glyph = expanded ? tick.letter : tick.bar;

            return (
              <div
                key={tick.id}
                className="relative flex flex-col items-center self-end"
              >
                {isActiveTick && !isSelected && (
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
                    onFocus={() => onActiveChange(tick.id)}
                    onBlur={() => onActiveChange(null)}
                    onClick={() => onTickSelect(tick.id)}
                    className={cn(
                      "timeline-tick flex items-end justify-center font-bold leading-none",
                      showBars && !expanded && "timeline-tick--bar",
                      expanded && "timeline-tick--expanded",
                      isActiveTick && !isSelected && "timeline-tick--active",
                      isSelected && "timeline-tick--pinned"
                    )}
                >
                  {glyph}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
