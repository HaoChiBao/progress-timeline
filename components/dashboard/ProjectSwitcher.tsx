"use client";

import type { TimelineProject } from "@/lib/timeline/project-storage";
import {
  getActiveProjects,
  getArchivedProjects,
  isProjectArchived,
} from "@/lib/timeline/project-storage";
import { cn } from "@/lib/utils";
import { useState } from "react";

type ProjectSwitcherProps = {
  projects: TimelineProject[];
  activeProjectId: string;
  viewMode: "single" | "all";
  onViewModeChange: (mode: "single" | "all") => void;
  onSelect: (projectId: string) => void;
  onCreate: (name: string) => void;
  onArchive: (projectId: string) => void;
  onRestore: (projectId: string) => void;
};

export function ProjectSwitcher({
  projects,
  activeProjectId,
  viewMode,
  onViewModeChange,
  onSelect,
  onCreate,
  onArchive,
  onRestore,
}: ProjectSwitcherProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");

  const activeProjects = getActiveProjects(projects);
  const archivedProjects = getArchivedProjects(projects);
  const activeProject = projects.find((p) => p.id === activeProjectId);
  const canArchiveActive =
    activeProject &&
    !isProjectArchived(activeProject) &&
    activeProjects.length > 1;

  const handleCreate = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    setNewName("");
    setIsCreating(false);
  };

  return (
    <aside className="w-full">
      <div className="mb-4 flex gap-2 text-xs">
        <button
          type="button"
          onClick={() => onViewModeChange("single")}
          className={cn(
            viewMode === "single"
              ? "text-ink"
              : "text-muted-soft hover:text-ink"
          )}
        >
          {viewMode === "single" ? "> one" : "  one"}
        </button>
        <button
          type="button"
          onClick={() => onViewModeChange("all")}
          className={cn(
            viewMode === "all" ? "text-ink" : "text-muted-soft hover:text-ink"
          )}
        >
          {viewMode === "all" ? "> all" : "  all"}
        </button>
      </div>

      <p className="mb-3 text-muted-soft">projects</p>

      <ul className="space-y-1">
        {activeProjects.map((project) => (
          <li key={project.id}>
            <button
              type="button"
              onClick={() => onSelect(project.id)}
              className={cn(
                "w-full py-0.5 text-left hover:text-ink",
                project.id === activeProjectId
                  ? "text-ink"
                  : "text-muted-text"
              )}
            >
              {project.id === activeProjectId ? "> " : "  "}
              {project.name}
            </button>
          </li>
        ))}
      </ul>

      {canArchiveActive && (
        <button
          type="button"
          onClick={() => onArchive(activeProjectId)}
          className="mt-3 text-muted-soft hover:text-ink"
        >
          [ archive ]
        </button>
      )}

      {archivedProjects.length > 0 && (
        <div className="mt-6 border-t border-hairline pt-4">
          <p className="mb-2 text-xs text-muted-soft">archived</p>
          <ul className="space-y-1">
            {archivedProjects.map((project) => (
              <li key={project.id} className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onSelect(project.id)}
                  className={cn(
                    "flex-1 py-0.5 text-left hover:text-ink",
                    project.id === activeProjectId
                      ? "text-ink"
                      : "text-muted-soft"
                  )}
                >
                  {project.id === activeProjectId ? "> " : "  "}
                  {project.name}
                </button>
                <button
                  type="button"
                  onClick={() => onRestore(project.id)}
                  className="shrink-0 text-xs text-muted-soft hover:text-ink"
                  title="Restore project"
                >
                  restore
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isCreating ? (
        <div className="mt-4 space-y-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="project name"
            autoFocus
            className="w-full border border-hairline bg-transparent px-2 py-1 text-ink placeholder:text-muted-soft outline-none focus:border-muted-soft"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
              if (e.key === "Escape") setIsCreating(false);
            }}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCreate}
              className="border border-hairline px-2 py-0.5 text-ink hover:bg-surface-soft"
            >
              [ create ]
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-muted-soft hover:text-ink"
            >
              esc
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="mt-4 text-muted-soft hover:text-ink"
        >
          [+ new project]
        </button>
      )}
    </aside>
  );
}
