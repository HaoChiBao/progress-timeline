import type { ProjectSummary } from "@/lib/types/project";
import { BookOpen, Plug, Route } from "lucide-react";

type ActivitySummaryProps = {
  projects: ProjectSummary[];
};

export function ActivitySummary({ projects }: ActivitySummaryProps) {
  const totalEvents = projects.reduce((sum, p) => sum + p.eventCount, 0);
  const totalDocs = projects.reduce((sum, p) => sum + p.docCount, 0);
  const totalIntegrations = projects.reduce(
    (sum, p) => sum + p.integrationCount,
    0
  );

  const stats = [
    {
      label: "Projects",
      value: projects.length,
      icon: Route,
      detail: "Across your workspace",
    },
    {
      label: "Events",
      value: totalEvents,
      icon: Route,
      detail: "On the activity trail",
    },
    {
      label: "Docs",
      value: totalDocs,
      icon: BookOpen,
      detail: "Living documentation",
    },
    {
      label: "Sources",
      value: totalIntegrations,
      icon: Plug,
      detail: "Connected integrations",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-lg border border-hairline bg-surface-card p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-text">{stat.label}</p>
              <Icon className="size-4 text-muted-soft" />
            </div>
            <p className="mt-2 font-display text-3xl text-ink">{stat.value}</p>
            <p className="mt-1 text-xs text-muted-soft">{stat.detail}</p>
          </div>
        );
      })}
    </div>
  );
}
