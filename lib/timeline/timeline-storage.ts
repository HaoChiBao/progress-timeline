import type { TimelineProject } from "@/lib/timeline/project-storage";
import type { TimelineTick } from "@/lib/timeline/event-catalog";

const STORAGE_PREFIX = "pg-timeline-ticks";

function storageKey(projectId: string) {
  return `${STORAGE_PREFIX}:${projectId}`;
}

export function getSeedTicks(projectId: string): TimelineTick[] {
  const now = Date.now();
  return [
    {
      id: "seed_1",
      projectId,
      source: "general",
      eventType: "general.scope_defined",
      occurredAt: new Date(now - 86400000 * 14).toISOString(),
      createdAt: new Date(now - 86400000 * 14).toISOString(),
    },
    {
      id: "seed_2",
      projectId,
      source: "linear",
      eventType: "linear.ticket_created",
      occurredAt: new Date(now - 86400000 * 10).toISOString(),
      createdAt: new Date(now - 86400000 * 10).toISOString(),
    },
    {
      id: "seed_3",
      projectId,
      source: "github",
      eventType: "github.push",
      occurredAt: new Date(now - 86400000 * 5).toISOString(),
      createdAt: new Date(now - 86400000 * 5).toISOString(),
    },
    {
      id: "seed_4",
      projectId,
      source: "notion",
      eventType: "notion.page_updated",
      occurredAt: new Date(now - 86400000 * 2).toISOString(),
      createdAt: new Date(now - 86400000 * 2).toISOString(),
    },
    {
      id: "seed_5",
      projectId,
      source: "linear",
      eventType: "linear.ticket_completed",
      occurredAt: new Date(now - 86400000).toISOString(),
      createdAt: new Date(now - 86400000).toISOString(),
    },
  ];
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

export function createTick(
  projectId: string,
  input: {
    source: TimelineTick["source"];
    eventType: string;
    note?: string;
  }
): TimelineTick {
  const now = new Date().toISOString();
  return {
    id: `tick_${crypto.randomUUID()}`,
    projectId,
    source: input.source,
    eventType: input.eventType,
    note: input.note?.trim() || undefined,
    occurredAt: now,
    createdAt: now,
  };
}

export function addTick(
  projectId: string,
  input: Parameters<typeof createTick>[1]
): TimelineTick {
  const ticks = loadTicks(projectId);
  const tick = createTick(projectId, input);
  const next = [...ticks, tick].sort(
    (a, b) =>
      new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime()
  );
  saveTicks(projectId, next);
  return tick;
}
