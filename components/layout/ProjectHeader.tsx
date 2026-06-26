import { SourceBadge } from "@/components/tickets/SourceBadge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/types/project";
import { Plus } from "lucide-react";

type ProjectHeaderProps = {
  project: Project;
  subtitle?: string;
  actionLabel?: string;
};

export function ProjectHeader({
  project,
  subtitle,
  actionLabel = "Add event",
}: ProjectHeaderProps) {
  return (
    <header className="border-b border-hairline bg-canvas px-8 py-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-soft">
            Project
          </p>
          <h1 className="mt-1 font-display text-3xl tracking-tight text-ink">
            {project.name}
          </h1>
          {(subtitle || project.description) && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-text">
              {subtitle ?? project.description}
            </p>
          )}
        </div>
        <Button size="sm">
          <Plus className="size-4" />
          {actionLabel}
        </Button>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className="inline-flex items-center rounded-full border border-hairline bg-surface-card px-2.5 py-0.5 text-xs font-medium capitalize text-muted-text">
          {project.status}
        </span>
        <SourceBadge source="manual" />
      </div>
    </header>
  );
}
