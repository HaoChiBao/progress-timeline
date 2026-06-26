import { ActivityFeed } from "@/components/timeline/ActivityFeed";
import { TicketCard } from "@/components/tickets/TicketCard";
import type { ProjectSummary } from "@/lib/types/project";
import { getEventsForProject, getTicketsForProject } from "@/lib/mock-data";
import Link from "next/link";

type ProjectOverviewProps = {
  project: ProjectSummary;
};

export function ProjectOverview({ project }: ProjectOverviewProps) {
  const tickets = getTicketsForProject(project.id).slice(0, 4);
  const events = getEventsForProject(project.id).slice(0, 3);

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <section className="lg:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-ink">Active work</h2>
          <Link
            href={`/projects/${project.id}/timeline`}
            className="text-sm font-medium text-primary hover:text-primary-active"
          >
            View timeline
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              title={ticket.title}
              summary={ticket.summary}
              priority={ticket.priority}
              status={ticket.status}
              source={ticket.source}
              assignee={ticket.assignee}
              artifactCount={ticket.artifactCount}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-display text-xl text-ink">Activity trail</h2>
        <ActivityFeed events={events} />
      </section>
    </div>
  );
}
