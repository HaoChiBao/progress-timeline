"use client";

import {
  DEFAULT_FILTERS,
  type TimelineFilterState,
  type TimeRange,
} from "@/lib/timeline/tick-filters";
import {
  TIMELINE_SOURCE_LIST,
  type TimelineSource,
} from "@/lib/timeline/event-catalog";
import { cn } from "@/lib/utils";
import { useState } from "react";

export type TimelineVisualMode = "bars" | "reveal" | "letters" | "list";

type TimelineDockProps = {
  visualMode: TimelineVisualMode;
  filters: TimelineFilterState;
  onVisualModeChange: (mode: TimelineVisualMode) => void;
  onFiltersChange: (filters: TimelineFilterState) => void;
  onExportWeek: () => void;
  exportStatus: string | null;
};

const VISUAL_OPTIONS: {
  value: TimelineVisualMode;
  label: string;
  hint: string;
}[] = [
  { value: "bars", label: "| bars", hint: "compact ticks — see full span" },
  { value: "reveal", label: "hover", hint: "bars until hover reveals letters" },
  { value: "letters", label: "A–Z", hint: "always show source letters" },
  { value: "list", label: "list", hint: "accessible chronological list" },
];

const TIME_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: "all", label: "all" },
  { value: "week", label: "week" },
  { value: "today", label: "today" },
];

export function TimelineDock({
  visualMode,
  filters,
  onVisualModeChange,
  onFiltersChange,
  onExportWeek,
  exportStatus,
}: TimelineDockProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const setFilter = <K extends keyof TimelineFilterState>(
    key: K,
    value: TimelineFilterState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasAdvancedFilters =
    filters.source !== "all" || filters.tag.trim() !== "" || filters.hideMinor;

  return (
    <div
      className="pointer-events-none fixed bottom-6 left-1/2 z-20 w-[min(100%-3rem,42rem)] -translate-x-1/2"
      role="toolbar"
      aria-label="Timeline view and filters"
    >
      <div className="pointer-events-auto rounded-lg border border-hairline bg-canvas/95 px-4 py-3 shadow-subtle backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-xs">
          <span className="mr-1 text-muted-soft">view</span>
          {VISUAL_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              title={opt.hint}
              onClick={() => onVisualModeChange(opt.value)}
              className={cn(
                "min-h-9 rounded-sm px-2.5 py-1.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                visualMode === opt.value
                  ? "bg-surface-soft text-ink"
                  : "text-muted-soft hover:bg-surface-soft/60 hover:text-ink"
              )}
              aria-pressed={visualMode === opt.value}
            >
              {visualMode === opt.value ? `> ${opt.label}` : opt.label}
            </button>
          ))}

          <span className="mx-2 hidden h-4 w-px bg-hairline sm:inline-block" aria-hidden />

          <span className="text-muted-soft">when</span>
          {TIME_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFilter("timeRange", opt.value)}
              className={cn(
                "min-h-9 rounded-sm px-2.5 py-1.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                filters.timeRange === opt.value
                  ? "bg-surface-soft text-ink"
                  : "text-muted-soft hover:bg-surface-soft/60 hover:text-ink"
              )}
              aria-pressed={filters.timeRange === opt.value}
            >
              {filters.timeRange === opt.value ? `· ${opt.label}` : opt.label}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setAdvancedOpen((v) => !v)}
            className={cn(
              "ml-1 min-h-9 rounded-sm border border-hairline px-2.5 py-1.5 transition-colors hover:bg-surface-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
              hasAdvancedFilters ? "text-ink" : "text-muted-soft"
            )}
            aria-expanded={advancedOpen}
            aria-controls="timeline-dock-advanced"
          >
            {advancedOpen ? "[ − ]" : "[ ··· ]"}
          </button>
        </div>

        {advancedOpen && (
          <div
            id="timeline-dock-advanced"
            className="mt-3 flex flex-col gap-3 border-t border-hairline pt-3 text-xs"
          >
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="dock-filter-source" className="text-muted-soft">
                source
              </label>
              <select
                id="dock-filter-source"
                value={filters.source}
                onChange={(e) =>
                  setFilter("source", e.target.value as TimelineSource | "all")
                }
                className="min-h-9 rounded-sm border border-hairline bg-transparent px-2 py-1 text-ink focus:border-ink focus:outline-none"
              >
                <option value="all">all</option>
                {TIMELINE_SOURCE_LIST.map((src) => (
                  <option key={src.id} value={src.id}>
                    {src.label}
                  </option>
                ))}
              </select>

              <label htmlFor="dock-filter-tag" className="ml-2 text-muted-soft">
                tag
              </label>
              <input
                id="dock-filter-tag"
                type="search"
                value={filters.tag}
                onChange={(e) => setFilter("tag", e.target.value)}
                placeholder="#launch"
                className="min-h-9 min-w-28 flex-1 rounded-sm border border-hairline bg-transparent px-2 py-1 text-ink placeholder:text-muted-soft focus:border-ink focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="flex min-h-9 cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.hideMinor}
                  onChange={(e) => setFilter("hideMinor", e.target.checked)}
                  className="h-4 w-4 accent-primary-hex"
                />
                <span className="text-muted-text">hide minor updates</span>
              </label>

              <button
                type="button"
                onClick={onExportWeek}
                className="min-h-9 rounded-sm border border-hairline px-3 py-1 text-ink hover:bg-surface-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                copy week
              </button>
            </div>

            <p className="text-muted-soft">
              <kbd className="text-ink">n</kbd> add ·{" "}
              <kbd className="text-ink">l</kbd> cycle view ·{" "}
              <kbd className="text-ink">e</kbd> export ·{" "}
              <kbd className="text-ink">z</kbd> undo
            </p>
          </div>
        )}

        {exportStatus && (
          <p className="mt-2 text-center text-xs text-muted-soft" role="status" aria-live="polite">
            {exportStatus}
          </p>
        )}
      </div>
    </div>
  );
}

export { DEFAULT_FILTERS };
