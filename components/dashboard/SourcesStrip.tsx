"use client";

import { listAllSources } from "@/lib/timeline/source-registry";
import { cn } from "@/lib/utils";

type SourcesStripProps = {
  onAddSource?: () => void;
  refreshKey?: number;
};

/** Compact source glyphs — bottom-left of dashboard. */
export function SourcesStrip({ onAddSource, refreshKey = 0 }: SourcesStripProps) {
  const sources = listAllSources();

  return (
    <div
      className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted-soft"
      aria-label="Timeline sources"
      key={refreshKey}
    >
      <span className="text-muted-soft">sources</span>
      {sources.map((src) => (
        <span
          key={src.id}
          className="inline-flex items-center gap-1"
          title={src.label}
        >
          <span
            style={{ color: src.color }}
            className="text-sm font-bold leading-none"
            aria-hidden
          >
            {src.character}
          </span>
          {!src.builtIn && (
            <span className="sr-only">{src.label}</span>
          )}
        </span>
      ))}
      {onAddSource && (
        <button
          type="button"
          onClick={onAddSource}
          className={cn(
            "ml-1 min-h-8 min-w-8 text-muted-soft hover:text-ink",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          )}
          aria-label="Add custom source"
          title="Add custom source"
        >
          [+]
        </button>
      )}
    </div>
  );
}
