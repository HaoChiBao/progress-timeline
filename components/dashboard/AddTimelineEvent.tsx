"use client";

import { AsciiDropdown } from "@/components/dashboard/AsciiDropdown";
import {
  TIMELINE_SOURCES,
  type TimelineSource,
} from "@/lib/timeline/event-catalog";

type AddTimelineEventProps = {
  source: TimelineSource;
  eventType: string;
  note: string;
  onSourceChange: (source: TimelineSource) => void;
  onEventTypeChange: (eventType: string) => void;
  onNoteChange: (note: string) => void;
  onAdd: () => void;
  onCancel: () => void;
};

export function AddTimelineEvent({
  source,
  eventType,
  note,
  onSourceChange,
  onEventTypeChange,
  onNoteChange,
  onAdd,
  onCancel,
}: AddTimelineEventProps) {
  const sourceOptions = (Object.keys(TIMELINE_SOURCES) as TimelineSource[]).map(
    (key) => ({
      value: key,
      label: TIMELINE_SOURCES[key].label,
    })
  );

  const typeOptions = TIMELINE_SOURCES[source].types.map((t) => ({
    value: t.id,
    label: t.label,
  }));

  return (
    <aside className="w-full">
      <p className="mb-4 text-muted-soft">+ add tick</p>

      <div className="space-y-4">
        <AsciiDropdown
          label="source"
          value={source}
          options={sourceOptions}
          onChange={onSourceChange}
        />

        <AsciiDropdown
          label="type"
          value={eventType}
          options={typeOptions}
          onChange={onEventTypeChange}
        />

        <label className="block">
          <span className="mb-1 block text-muted-soft">note</span>
          <input
            type="text"
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder="optional"
            className="w-full border border-hairline bg-transparent px-2 py-1 text-ink placeholder:text-muted-soft outline-none focus:border-muted-soft"
            onKeyDown={(e) => e.key === "Enter" && onAdd()}
          />
        </label>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onAdd}
            className="border border-hairline px-3 py-1 text-ink hover:bg-surface-soft"
          >
            [ add | ]
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-2 py-1 text-muted-soft hover:text-ink"
          >
            esc
          </button>
        </div>
      </div>
    </aside>
  );
}
