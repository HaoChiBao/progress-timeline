import { DocList } from "@/components/docs/DocList";
import { EmptyState } from "@/components/layout/EmptyState";
import { Button } from "@/components/ui/button";
import { getDocsForProject } from "@/lib/mock-data";
import { FileText, Plus } from "lucide-react";

type DocsPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function DocsPage({ params }: DocsPageProps) {
  const { projectId } = await params;
  const docs = getDocsForProject(projectId);

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl text-ink">Docs</h2>
          <p className="mt-1 text-sm text-muted-text">
            Collaborative living documentation for this project.
          </p>
        </div>
        <Button size="sm" disabled>
          <Plus className="size-4" />
          New doc
        </Button>
      </div>

      {docs.length > 0 ? (
        <DocList docs={docs} projectId={projectId} />
      ) : (
        <EmptyState
          icon={FileText}
          title="No docs yet"
          description="Create your first living document to capture decisions, architecture, and project memory."
        />
      )}
    </section>
  );
}
