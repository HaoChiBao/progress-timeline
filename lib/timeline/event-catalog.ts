/** Tech / tool the event came from. */
export type TimelineSource =
  | "github"
  | "linear"
  | "notion"
  | "figma"
  | "general";

export type TimelineTick = {
  id: string;
  projectId: string;
  source: TimelineSource;
  /** Subcategory id from the event catalog, e.g. `github.push`. */
  eventType: string;
  /** Optional short note when adding manually. */
  note?: string;
  occurredAt: string;
  createdAt: string;
};

export type TimelineSourceMeta = {
  id: TimelineSource;
  label: string;
  color: string;
  types: { id: string; label: string }[];
};

export const TIMELINE_SOURCES: Record<TimelineSource, TimelineSourceMeta> = {
  github: {
    id: "github",
    label: "github",
    color: "#3b82f6",
    types: [
      { id: "github.push", label: "push" },
      { id: "github.pr_opened", label: "pr opened" },
      { id: "github.pr_merged", label: "pr merged" },
      { id: "github.commit", label: "commit" },
    ],
  },
  linear: {
    id: "linear",
    label: "linear",
    color: "#a855f7",
    types: [
      { id: "linear.ticket_created", label: "ticket created" },
      { id: "linear.ticket_updated", label: "ticket updated" },
      { id: "linear.ticket_completed", label: "ticket completed" },
    ],
  },
  notion: {
    id: "notion",
    label: "notion",
    color: "#78716c",
    types: [
      { id: "notion.page_updated", label: "updated notion" },
      { id: "notion.task_defined", label: "defined task" },
      { id: "notion.scope_defined", label: "defined scope" },
    ],
  },
  figma: {
    id: "figma",
    label: "figma",
    color: "#f97316",
    types: [
      { id: "figma.file_updated", label: "file updated" },
      { id: "figma.comment", label: "comment added" },
    ],
  },
  general: {
    id: "general",
    label: "general",
    color: "#22c55e",
    types: [
      { id: "general.task_defined", label: "defined project task" },
      { id: "general.scope_defined", label: "defined scope" },
      { id: "general.milestone", label: "milestone reached" },
      { id: "general.note", label: "note added" },
    ],
  },
};

export function getSourceColor(source: TimelineSource): string {
  return TIMELINE_SOURCES[source].color;
}

export function getEventTypeLabel(
  source: TimelineSource,
  eventType: string
): string {
  const meta = TIMELINE_SOURCES[source].types.find((t) => t.id === eventType);
  return meta?.label ?? eventType;
}

export function defaultEventType(source: TimelineSource): string {
  return TIMELINE_SOURCES[source].types[0].id;
}

export const TIMELINE_SOURCE_LIST = Object.values(TIMELINE_SOURCES);
