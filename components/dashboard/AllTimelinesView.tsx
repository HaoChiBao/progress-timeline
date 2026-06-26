"use client";

import { AsciiTimeline } from "@/components/dashboard/AsciiTimeline";
import type { TimelineVisualMode } from "@/components/dashboard/TimelineDock";
import type { TimelineProject } from "@/lib/timeline/project-storage";
import {
  getActiveProjects,
  getArchivedProjects,
} from "@/lib/timeline/project-storage";
import type { TimelineTick } from "@/lib/timeline/event-catalog";

type AllTimelinesViewProps = {
  projects: TimelineProject[];
  ticksByProject: Record<string, TimelineTick[]>;
  activeProjectId: string;
  visualMode: TimelineVisualMode;
  onSelectProject: (projectId: string) => void;
  onStartAdd: (projectId: string) => void;
};

export function AllTimelinesView({
  projects,
  ticksByProject,
  activeProjectId,
  visualMode,
  onSelectProject,
  onStartAdd,
}: AllTimelinesViewProps) {
  const activeProjects = getActiveProjects(projects);
  const archivedProjects = getArchivedProjects(projects);

  return (
    <div className="flex w-full max-w-[min(100%,56rem)] flex-col items-center gap-12">
      {activeProjects.map((project) => (
        <AsciiTimeline
          key={project.id}
          ticks={ticksByProject[project.id] ?? []}
          projectName={project.name}
          visualMode={visualMode}
          onStartAdd={() => {
            onSelectProject(project.id);
            onStartAdd(project.id);
          }}
          allowAdd
          centered
          isActive={project.id === activeProjectId}
          onSelect={() => onSelectProject(project.id)}
        />
      ))}

      {archivedProjects.length > 0 && (
        <div className="w-full border-t border-hairline pt-8">
          <p className="mb-6 text-center text-xs text-muted-soft">archived</p>
          <div className="flex flex-col items-center gap-12">
            {archivedProjects.map((project) => (
              <AsciiTimeline
                key={project.id}
                ticks={ticksByProject[project.id] ?? []}
                projectName={project.name}
                visualMode={visualMode}
                onStartAdd={() => onSelectProject(project.id)}
                allowAdd={false}
                centered
                isActive={project.id === activeProjectId}
                onSelect={() => onSelectProject(project.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
