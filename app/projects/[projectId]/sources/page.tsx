import { EmptyState } from "@/components/layout/EmptyState";
import { SourceBadge } from "@/components/tickets/SourceBadge";
import { Button } from "@/components/ui/button";
import { getIntegrationsForProject } from "@/lib/mock-data";
import type { Integration, IntegrationProvider } from "@/lib/types/integration";
import { Plug, Plus } from "lucide-react";

const providerLabels: Record<IntegrationProvider, string> = {
  linear: "Linear",
  github: "GitHub",
  figma: "Figma",
};

type SourcesPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function SourcesPage({ params }: SourcesPageProps) {
  const { projectId } = await params;
  const integrations: Integration[] = getIntegrationsForProject(projectId);

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl text-ink">Sources</h2>
          <p className="mt-1 text-sm text-muted-text">
            Connect tools to populate your activity trail and source herd.
          </p>
        </div>
        <Button size="sm" disabled>
          <Plus className="size-4" />
          Add source
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className="rounded-lg border border-hairline bg-surface-card p-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-sans text-base font-medium text-ink">
                {providerLabels[integration.provider]}
              </h3>
              <SourceBadge source={integration.provider} />
            </div>
            <p className="mt-2 text-sm capitalize text-muted-text">
              {integration.status}
            </p>
            <Button variant="outline" size="sm" className="mt-4" disabled>
              Connect
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <EmptyState
          icon={Plug}
          title="OAuth integrations coming soon"
          description="GitHub, Linear, and Figma connections are scaffolded in the schema and API routes but not implemented in this foundation pass."
        />
      </div>
    </section>
  );
}
