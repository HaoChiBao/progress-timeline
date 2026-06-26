import type { EventSource } from "@/lib/types/event";
import { cn } from "@/lib/utils";
import {
  Bot,
  Figma,
  GitBranch,
  GitPullRequest,
  Pencil,
} from "lucide-react";

const sourceConfig: Record<
  EventSource,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  linear: { label: "Linear", icon: GitBranch },
  github: { label: "GitHub", icon: GitPullRequest },
  figma: { label: "Figma", icon: Figma },
  manual: { label: "Manual", icon: Pencil },
  ai: { label: "AI", icon: Bot },
};

type SourceBadgeProps = {
  source: EventSource;
  className?: string;
};

export function SourceBadge({ source, className }: SourceBadgeProps) {
  const config = sourceConfig[source];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-hairline bg-canvas px-2.5 py-0.5 text-xs font-medium text-muted-text",
        className
      )}
    >
      <Icon className="size-3" />
      {config.label}
    </span>
  );
}
