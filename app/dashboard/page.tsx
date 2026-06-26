import { ActivitySummary } from "@/components/dashboard/ActivitySummary";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/layout/EmptyState";
import { TicketCard } from "@/components/tickets/TicketCard";
import { Button } from "@/components/ui/button";
import { mockProjects, mockTickets, mockWorkspace } from "@/lib/mock-data";
import { Plus, Route } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const featuredProject = mockProjects[0];
  const recentTickets = mockTickets.slice(0, 3);

  return (
    <AppShell projectId={featuredProject.id}>
      <div className="border-b border-hairline bg-canvas px-8 py-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-soft">
          {mockWorkspace.name}
        </p>
        <h1 className="mt-1 font-display text-3xl tracking-tight text-ink">
          Dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-text">
          Your project intelligence hub — timelines, docs, and activity trails
          in one calm workspace.
        </p>
      </div>

      <div className="flex-1 space-y-8 px-8 py-8">
        <ActivitySummary projects={mockProjects} />

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl text-ink">Projects</h2>
            <Button variant="outline" size="sm" disabled>
              <Plus className="size-4" />
              New project
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {mockProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="rounded-lg border border-hairline bg-surface-card p-5 transition-colors hover:border-[#6f7c5d]/30"
              >
                <h3 className="font-sans text-base font-medium text-ink">
                  {project.name}
                </h3>
                {project.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-muted-text">
                    {project.description}
                  </p>
                )}
                <div className="mt-4 flex gap-4 text-xs text-muted-soft">
                  <span>{project.eventCount} events</span>
                  <span>{project.docCount} docs</span>
                  <span>{project.integrationCount} sources</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl text-ink">Recent work</h2>
            <Link
              href={`/projects/${featuredProject.id}`}
              className="text-sm font-medium text-primary hover:text-primary-active"
            >
              View {featuredProject.name}
            </Link>
          </div>
          <div className="grid gap-3 lg:grid-cols-3">
            {recentTickets.map((ticket) => (
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

        <EmptyState
          icon={Route}
          title="Connect your source herd"
          description="Linear, GitHub, and Figma integrations are scaffolded but not wired yet. Your activity trail will populate here once sources are connected."
          action={
            <Button variant="outline" size="sm" disabled>
              Connect sources
            </Button>
          }
        />
      </div>
    </AppShell>
  );
}
