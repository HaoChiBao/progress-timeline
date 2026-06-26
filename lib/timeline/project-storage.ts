export type TimelineProject = {
  id: string;
  name: string;
  createdAt: string;
  archivedAt?: string;
};

const PROJECTS_KEY = "pg-timeline-projects";
const ACTIVE_PROJECT_KEY = "pg-timeline-active-project";

const DEFAULT_PROJECTS: TimelineProject[] = [
  {
    id: "proj_progress_goat",
    name: "ProgressGoat",
    createdAt: "2026-02-01T09:00:00Z",
  },
];

export function isProjectArchived(project: TimelineProject): boolean {
  return Boolean(project.archivedAt);
}

export function loadProjects(): TimelineProject[] {
  if (typeof window === "undefined") return DEFAULT_PROJECTS;
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (!raw) {
      saveProjects(DEFAULT_PROJECTS);
      return DEFAULT_PROJECTS;
    }
    return JSON.parse(raw) as TimelineProject[];
  } catch {
    return DEFAULT_PROJECTS;
  }
}

export function saveProjects(projects: TimelineProject[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function loadActiveProjectId(): string {
  if (typeof window === "undefined") return DEFAULT_PROJECTS[0].id;
  return (
    localStorage.getItem(ACTIVE_PROJECT_KEY) ?? DEFAULT_PROJECTS[0].id
  );
}

export function saveActiveProjectId(projectId: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTIVE_PROJECT_KEY, projectId);
}

export function createProject(name: string): TimelineProject {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Project name required");

  const project: TimelineProject = {
    id: `proj_${crypto.randomUUID()}`,
    name: trimmed,
    createdAt: new Date().toISOString(),
  };

  saveProjects([...loadProjects(), project]);
  return project;
}

export function archiveProject(projectId: string): TimelineProject[] {
  const projects = loadProjects();
  const activeCount = projects.filter((p) => !isProjectArchived(p)).length;
  const target = projects.find((p) => p.id === projectId);
  if (!target || isProjectArchived(target)) return projects;
  if (activeCount <= 1) return projects;

  const next = projects.map((p) =>
    p.id === projectId
      ? { ...p, archivedAt: new Date().toISOString() }
      : p
  );
  saveProjects(next);
  return next;
}

export function unarchiveProject(projectId: string): TimelineProject[] {
  const next = loadProjects().map((p) =>
    p.id === projectId ? { ...p, archivedAt: undefined } : p
  );
  saveProjects(next);
  return next;
}

export function getProjectById(
  projectId: string,
  projects: TimelineProject[]
): TimelineProject | undefined {
  return projects.find((p) => p.id === projectId);
}

export function getActiveProjects(projects: TimelineProject[]) {
  return projects.filter((p) => !isProjectArchived(p));
}

export function getArchivedProjects(projects: TimelineProject[]) {
  return projects.filter((p) => isProjectArchived(p));
}

export function resolveActiveProjectId(
  projects: TimelineProject[],
  preferredId: string
): string {
  const preferred = getProjectById(preferredId, projects);
  if (preferred && !isProjectArchived(preferred)) return preferredId;

  const active = getActiveProjects(projects);
  return active[0]?.id ?? preferredId;
}
