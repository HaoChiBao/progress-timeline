"use client";

import { CustomSourceForm } from "@/components/dashboard/CustomSourceForm";
import { AddTimelineEvent } from "@/components/dashboard/AddTimelineEvent";
import { AsciiTickDetail } from "@/components/dashboard/AsciiTickDetail";
import { ProjectSwitcher } from "@/components/dashboard/ProjectSwitcher";
import type { TimelineTick } from "@/lib/timeline/event-catalog";
import type { TimelineProject } from "@/lib/timeline/project-storage";
import type { TickDraft } from "@/lib/timeline/timeline-storage";
import { cn } from "@/lib/utils";

type TimelineLeftPanelProps = {
  projects: TimelineProject[];
  activeProjectId: string;
  viewMode: "single" | "all";
  onViewModeChange: (mode: "single" | "all") => void;
  onSelectProject: (projectId: string) => void;
  onCreateProject: (name: string) => void;
  onArchive: (projectId: string) => void;
  onRestore: (projectId: string) => void;
  selectedTick: TimelineTick | null;
  selectedProjectName: string;
  onCloseTick: () => void;
  isAdding: boolean;
  isAddingSource: boolean;
  isArchived: boolean;
  draft: TickDraft;
  sourcesRefreshKey: number;
  onSourceChange: (source: string) => void;
  onEventTypeChange: (eventType: string) => void;
  onNoteChange: (note: string) => void;
  onTagsChange: (tags: string) => void;
  onOccurredAtChange: (value: string) => void;
  onAdd: () => void;
  onCancelAdd: () => void;
  onCancelAddSource: () => void;
  onSourceAdded: () => void;
  onRepeatLast: () => void;
  hasLastPrefs: boolean;
  statusMessage: string | null;
  onNotePaste: (text: string) => void;
  undo: { tickId: string; projectId: string } | null;
  onUndo: () => void;
};

export function TimelineLeftPanel({
  projects,
  activeProjectId,
  viewMode,
  onViewModeChange,
  onSelectProject,
  onCreateProject,
  onArchive,
  onRestore,
  selectedTick,
  selectedProjectName,
  onCloseTick,
  isAdding,
  isAddingSource,
  isArchived,
  draft,
  sourcesRefreshKey,
  onSourceChange,
  onEventTypeChange,
  onNoteChange,
  onTagsChange,
  onOccurredAtChange,
  onAdd,
  onCancelAdd,
  onCancelAddSource,
  onSourceAdded,
  onRepeatLast,
  hasLastPrefs,
  statusMessage,
  onNotePaste,
  undo,
  onUndo,
}: TimelineLeftPanelProps) {
  const showActionPanel =
    Boolean(selectedTick) ||
    (isAdding && !isArchived) ||
    isAddingSource;

  return (
    <aside
      className={cn(
        "fixed left-4 top-8 z-20 flex max-h-[calc(100dvh-6rem)] w-52 flex-col overflow-y-auto",
        "font-mono text-sm lg:left-6 lg:w-56"
      )}
      aria-label="Project and event panel"
    >
      <div className="ascii-panel ascii-panel--project">
        <p className="mb-2 text-[10px] text-muted-soft">project</p>
        <ProjectSwitcher
          projects={projects}
          activeProjectId={activeProjectId}
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
          onSelect={onSelectProject}
          onCreate={onCreateProject}
          onArchive={onArchive}
          onRestore={onRestore}
        />
      </div>

      {showActionPanel && (
        <div className="ascii-panel mt-6">
          {isAddingSource ? (
            <CustomSourceForm
              onAdded={onSourceAdded}
              onCancel={onCancelAddSource}
            />
          ) : isAdding && !isArchived ? (
            <>
              <p className="mb-3 text-[10px] text-muted-soft">create event</p>
              <AddTimelineEvent
                source={draft.source}
                eventType={draft.eventType}
                note={draft.note}
                tags={draft.tags}
                occurredAt={draft.occurredAt}
                sourcesRefreshKey={sourcesRefreshKey}
                onSourceChange={onSourceChange}
                onEventTypeChange={onEventTypeChange}
                onNoteChange={onNoteChange}
                onTagsChange={onTagsChange}
                onOccurredAtChange={onOccurredAtChange}
                onAdd={onAdd}
                onCancel={onCancelAdd}
                onRepeatLast={onRepeatLast}
                hasLastPrefs={hasLastPrefs}
                statusMessage={statusMessage}
                onNotePaste={onNotePaste}
              />
            </>
          ) : selectedTick ? (
            <AsciiTickDetail
              tick={selectedTick}
              projectName={selectedProjectName}
              onClose={onCloseTick}
            />
          ) : null}
        </div>
      )}

      {undo && (
        <div role="status" aria-live="polite" className="mt-4 text-xs text-muted-soft">
          <button
            type="button"
            onClick={onUndo}
            className="min-h-11 text-ink underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            undo last tick (z)
          </button>
        </div>
      )}
    </aside>
  );
}
