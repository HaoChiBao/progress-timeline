import type { TimelineProject } from "@/lib/timeline/project-storage";
import type { TimelineSource, TimelineTick } from "@/lib/timeline/event-catalog";
import { mergeTags } from "@/lib/timeline/tick-tags";

const STORAGE_PREFIX = "pg-timeline-ticks";
const DRAFT_PREFIX = "pg-timeline-draft";
const LAST_PREFS_KEY = "pg-timeline-last-prefs";

export type TickDraft = {
  source: TimelineSource;
  eventType: string;
  note: string;
  tags: string;
  occurredAt: string;
  externalUrl: string;
};

export type LastTickPrefs = {
  source: TimelineSource;
  eventType: string;
};

function storageKey(projectId: string) {
  return `${STORAGE_PREFIX}:${projectId}`;
}

function draftKey(projectId: string) {
  return `${DRAFT_PREFIX}:${projectId}`;
}

export function emptyDraft(): TickDraft {
  return {
    source: "general",
    eventType: "general.note",
    note: "",
    tags: "",
    occurredAt: "",
    externalUrl: "",
  };
}

export function loadDraft(projectId: string): TickDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(draftKey(projectId));
    if (!raw) return null;
    return { ...emptyDraft(), ...JSON.parse(raw) } as TickDraft;
  } catch {
    return null;
  }
}

export function saveDraft(projectId: string, draft: TickDraft) {
  if (typeof window === "undefined") return;
  const hasContent =
    draft.note.trim() ||
    draft.tags.trim() ||
    draft.occurredAt ||
    draft.externalUrl.trim();
  if (!hasContent) {
    localStorage.removeItem(draftKey(projectId));
    return;
  }
  localStorage.setItem(draftKey(projectId), JSON.stringify(draft));
}

export function clearDraft(projectId: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(draftKey(projectId));
}

export function loadLastTickPrefs(): LastTickPrefs | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LAST_PREFS_KEY);
    return raw ? (JSON.parse(raw) as LastTickPrefs) : null;
  } catch {
    return null;
  }
}

export function saveLastTickPrefs(prefs: LastTickPrefs) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LAST_PREFS_KEY, JSON.stringify(prefs));
}

export function loadTicks(projectId: string): TimelineTick[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKey(projectId));
    if (!raw) return [];
    return JSON.parse(raw) as TimelineTick[];
  } catch {
    return [];
  }
}

export function loadTicksForProjects(
  projects: TimelineProject[]
): Record<string, TimelineTick[]> {
  return Object.fromEntries(
    projects.map((project) => [project.id, loadTicks(project.id)])
  );
}

export function saveTicks(projectId: string, ticks: TimelineTick[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(projectId), JSON.stringify(ticks));
}

export type CreateTickInput = {
  source: TimelineSource;
  eventType: string;
  note?: string;
  tags?: string;
  occurredAt?: string;
  externalUrl?: string;
};

export function createTick(
  projectId: string,
  input: CreateTickInput
): TimelineTick {
  const now = new Date().toISOString();
  const note = input.note?.trim() || undefined;
  const tags = note || input.tags ? mergeTags(note ?? "", input.tags) : undefined;

  return {
    id: `tick_${crypto.randomUUID()}`,
    projectId,
    source: input.source,
    eventType: input.eventType,
    note,
    tags: tags?.length ? tags : undefined,
    externalUrl: input.externalUrl?.trim() || undefined,
    occurredAt: input.occurredAt?.trim() || now,
    createdAt: now,
  };
}

export function addTick(
  projectId: string,
  input: CreateTickInput
): TimelineTick {
  const ticks = loadTicks(projectId);
  const tick = createTick(projectId, input);
  const next = [...ticks, tick].sort(
    (a, b) =>
      new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime()
  );
  saveTicks(projectId, next);
  saveLastTickPrefs({ source: input.source, eventType: input.eventType });
  return tick;
}

/** Remove a locally stored tick (undo). Returns false if tick not found. */
export function removeTick(projectId: string, tickId: string): boolean {
  const ticks = loadTicks(projectId);
  const next = ticks.filter((t) => t.id !== tickId);
  if (next.length === ticks.length) return false;
  saveTicks(projectId, next);
  return true;
}

/** True if tick id looks like a local manual tick (undoable). */
export function isLocalTickId(tickId: string): boolean {
  return tickId.startsWith("tick_");
}
