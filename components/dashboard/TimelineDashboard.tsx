"use client";

import { AddTimelineEvent } from "@/components/dashboard/AddTimelineEvent";
import { AllTimelinesView } from "@/components/dashboard/AllTimelinesView";
import { AsciiTimeline } from "@/components/dashboard/AsciiTimeline";
import { ProjectSwitcher } from "@/components/dashboard/ProjectSwitcher";
import { SourceLegend } from "@/components/dashboard/SourceLegend";
import {
  type TimelineSource,
  defaultEventType,
} from "@/lib/timeline/event-catalog";
import {
  archiveProject,
  createProject,
  getProjectById,
  isProjectArchived,
  loadActiveProjectId,
  loadProjects,
  resolveActiveProjectId,
  saveActiveProjectId,
  unarchiveProject,
} from "@/lib/timeline/project-storage";
import { addTick, loadTicks } from "@/lib/timeline/timeline-storage";
import {
  fetchServerTicks,
  mergeTicks,
} from "@/lib/timeline/merge-ticks";
import { useCallback, useEffect, useState } from "react";

const VIEW_MODE_KEY = "pg-timeline-view-mode";

export function TimelineDashboard() {
  const [projects, setProjects] = useState<ReturnType<typeof loadProjects>>([]);
  const [activeProjectId, setActiveProjectId] = useState("");
  const [viewMode, setViewMode] = useState<"single" | "all">("single");
  const [ticksByProject, setTicksByProject] = useState<
    Record<string, ReturnType<typeof loadTicks>>
  >({});
  const [ticks, setTicks] = useState<ReturnType<typeof loadTicks>>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [source, setSource] = useState<TimelineSource>("general");
  const [eventType, setEventType] = useState(() =>
    defaultEventType("general")
  );
  const [note, setNote] = useState("");

  const activeProject = getProjectById(activeProjectId, projects);
  const isArchived = activeProject ? isProjectArchived(activeProject) : false;

  const syncProjects = useCallback((nextProjects: ReturnType<typeof loadProjects>) => {
    setProjects(nextProjects);
    return nextProjects;
  }, []);

  const refreshTicks = useCallback(async () => {
    if (projects.length === 0) return;
    const serverByProject: Record<string, ReturnType<typeof loadTicks>> = {};
    for (const project of projects) {
      const local = loadTicks(project.id);
      const server = await fetchServerTicks(project.id);
      serverByProject[project.id] = mergeTicks(local, server);
    }
    setTicksByProject(serverByProject);
    if (activeProjectId) {
      const local = loadTicks(activeProjectId);
      const server = await fetchServerTicks(activeProjectId);
      setTicks(mergeTicks(local, server));
    }
  }, [projects, activeProjectId]);

  useEffect(() => {
    const loadedProjects = loadProjects();
    const activeId = resolveActiveProjectId(
      loadedProjects,
      loadActiveProjectId()
    );
    const savedView =
      typeof window !== "undefined"
        ? (localStorage.getItem(VIEW_MODE_KEY) as "single" | "all" | null)
        : null;

    setProjects(loadedProjects);
    setActiveProjectId(activeId);
    setViewMode(savedView === "all" ? "all" : "single");
    saveActiveProjectId(activeId);
  }, []);

  useEffect(() => {
    if (!activeProjectId) return;
    void refreshTicks();
    setIsAdding(false);
  }, [activeProjectId, refreshTicks]);

  useEffect(() => {
    if (projects.length > 0) void refreshTicks();
  }, [projects, refreshTicks]);

  useEffect(() => {
    const interval = setInterval(() => void refreshTicks(), 15_000);
    return () => clearInterval(interval);
  }, [refreshTicks]);

  useEffect(() => {
    if (!isAdding) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsAdding(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isAdding]);

  const handleViewModeChange = (mode: "single" | "all") => {
    setViewMode(mode);
    localStorage.setItem(VIEW_MODE_KEY, mode);
  };

  const handleSourceChange = (next: TimelineSource) => {
    setSource(next);
    setEventType(defaultEventType(next));
  };

  const handleAdd = async () => {
    if (!activeProjectId || isArchived) return;
    addTick(activeProjectId, { source, eventType, note });
    setNote("");
    await refreshTicks();
    setIsAdding(false);
  };

  const handleSelectProject = (projectId: string) => {
    setActiveProjectId(projectId);
    saveActiveProjectId(projectId);
  };

  const handleStartAdd = (projectId?: string) => {
    if (projectId) handleSelectProject(projectId);
    setIsAdding(true);
  };

  const handleCreateProject = async (name: string) => {
    const project = createProject(name);
    syncProjects(loadProjects());
    setActiveProjectId(project.id);
    saveActiveProjectId(project.id);
    await refreshTicks();
  };

  const handleArchive = async (projectId: string) => {
    const nextProjects = syncProjects(archiveProject(projectId));
    const nextActiveId = resolveActiveProjectId(nextProjects, activeProjectId);
    setActiveProjectId(nextActiveId);
    saveActiveProjectId(nextActiveId);
    await refreshTicks();
  };

  const handleRestore = async (projectId: string) => {
    syncProjects(unarchiveProject(projectId));
    setActiveProjectId(projectId);
    saveActiveProjectId(projectId);
    await refreshTicks();
  };

  if (!activeProject) return null;

  return (
    <div className="relative h-full w-full font-mono text-sm">
      <aside className="absolute left-6 top-1/2 z-10 -translate-y-1/2">
        <SourceLegend />
      </aside>

      <aside className="absolute right-6 top-1/2 z-10 w-56 -translate-y-1/2">
        <div className="flex flex-col gap-8">
          {isAdding && !isArchived && (
            <AddTimelineEvent
              source={source}
              eventType={eventType}
              note={note}
              onSourceChange={handleSourceChange}
              onEventTypeChange={setEventType}
              onNoteChange={setNote}
              onAdd={handleAdd}
              onCancel={() => setIsAdding(false)}
            />
          )}

          <ProjectSwitcher
            projects={projects}
            activeProjectId={activeProjectId}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            onSelect={handleSelectProject}
            onCreate={handleCreateProject}
            onArchive={handleArchive}
            onRestore={handleRestore}
          />
        </div>
      </aside>

      <div
        className={
          viewMode === "all"
            ? "flex h-full w-full items-center justify-center overflow-y-auto px-36 py-6"
            : "flex h-full w-full items-center justify-center overflow-hidden px-36"
        }
      >
        {viewMode === "all" ? (
          <AllTimelinesView
            projects={projects}
            ticksByProject={ticksByProject}
            activeProjectId={activeProjectId}
            onSelectProject={handleSelectProject}
            onStartAdd={handleStartAdd}
          />
        ) : (
          <div className="flex max-w-xl flex-col items-center">
            <AsciiTimeline
              ticks={ticks}
              projectName={activeProject.name}
              onStartAdd={() => handleStartAdd()}
              allowAdd={!isArchived}
              isActive
              centered
            />
            {isArchived && (
              <p className="mt-3 text-xs text-muted-soft">archived — view only</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
