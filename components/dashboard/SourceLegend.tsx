"use client";

import { TIMELINE_SOURCE_LIST } from "@/lib/timeline/event-catalog";

export function SourceLegend() {
  return (
    <aside
      className="w-28 shrink-0 text-xs text-muted-soft"
      aria-label="Timeline source legend"
    >
      <p className="mb-3 text-muted-soft">sources</p>
      <ul className="space-y-2">
        {TIMELINE_SOURCE_LIST.map((src) => (
          <li key={src.id} className="flex items-center gap-1.5">
            <span style={{ color: src.color }} className="text-base leading-none">
              |
            </span>
            <span>{src.label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
