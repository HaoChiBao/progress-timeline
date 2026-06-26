"use client";

import { AsciiDropdown } from "@/components/dashboard/AsciiDropdown";
import {
  TIMELINE_SOURCES,
  type TimelineSource,
} from "@/lib/timeline/event-catalog";
import { suggestSmartTags } from "@/lib/timeline/tick-tags";
import { useMemo } from "react";

type AddTimelineEventProps = {
  source: TimelineSource;
  eventType: string;
  note: string;
  tags: string;
  occurredAt: string;
  onSourceChange: (source: TimelineSource) => void;
  onEventTypeChange: (eventType: string) => void;
  onNoteChange: (note: string) => void;
  onTagsChange: (tags: string) => void;
  onOccurredAtChange: (value: string) => void;
  onAdd: () => void;
  onCancel: () => void;
  onRepeatLast?: () => void;
  hasLastPrefs?: boolean;
  statusMessage?: string | null;
  onNotePaste?: (text: string) => void;
};

export function AddTimelineEvent({
  source,
  eventType,
  note,
  tags,
  occurredAt,
  onSourceChange,
  onEventTypeChange,
  onNoteChange,
  onTagsChange,
  onOccurredAtChange,
  onAdd,
  onCancel,
  onRepeatLast,
  hasLastPrefs,
  statusMessage,
  onNotePaste,
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

  const smartTags = useMemo(() => suggestSmartTags(note), [note]);

  return (
    <aside className="w-full" aria-label="Add timeline tick">
      <p className="mb-4 text-muted-soft">+ add tick</p>

      <div
        className="space-y-4"
        role="form"
        aria-label="New timeline event form"
      >
        {hasLastPrefs && onRepeatLast && (
          <button
            type="button"
            onClick={onRepeatLast}
            className="min-h-11 text-muted-soft hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            [ same as last ]
          </button>
        )}

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
          <span className="mb-1 block text-muted-soft">note or paste link</span>
          <input
            type="text"
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            onPaste={(e) => {
              const text = e.clipboardData.getData("text");
              if (text && onNotePaste) onNotePaste(text);
            }}
            placeholder="what happened? paste Linear/GitHub/Notion URL"
            className="min-h-11 w-full border border-hairline bg-transparent px-2 py-2 text-ink placeholder:text-muted-soft focus:border-ink focus:outline-none"
            onKeyDown={(e) => e.key === "Enter" && onAdd()}
            autoFocus
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-muted-soft">
            tags <span className="text-muted-soft">(# in note works too)</span>
          </span>
          <input
            type="text"
            value={tags}
            onChange={(e) => onTagsChange(e.target.value)}
            placeholder="launch, auth"
            className="min-h-11 w-full border border-hairline bg-transparent px-2 py-2 text-ink placeholder:text-muted-soft focus:border-ink focus:outline-none"
          />
          {smartTags.length > 0 && !tags && (
            <p className="mt-1 text-xs text-muted-soft">
              suggested: {smartTags.map((t) => `#${t}`).join(" ")}
            </p>
          )}
        </label>

        <label className="block">
          <span className="mb-1 block text-muted-soft">
            when <span className="text-muted-soft">(leave empty = now)</span>
          </span>
          <input
            type="datetime-local"
            value={occurredAt}
            onChange={(e) => onOccurredAtChange(e.target.value)}
            className="min-h-11 w-full border border-hairline bg-transparent px-2 py-2 text-ink focus:border-ink focus:outline-none"
          />
        </label>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onAdd}
            className="min-h-11 border border-hairline px-3 py-2 text-ink hover:bg-surface-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            [ add | ]
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="min-h-11 px-3 py-2 text-muted-soft hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            esc
          </button>
        </div>

        <div role="status" aria-live="polite" className="min-h-4 text-xs text-muted-soft">
          {statusMessage}
        </div>
      </div>
    </aside>
  );
}
