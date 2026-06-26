import { CollaborativeEditorPlaceholder } from "@/components/docs/CollaborativeEditorPlaceholder";
import { getDocsForProject } from "@/lib/mock-data";
import { notFound } from "next/navigation";

type DocPageProps = {
  params: Promise<{ projectId: string; docId: string }>;
};

export default async function DocPage({ params }: DocPageProps) {
  const { projectId, docId } = await params;
  const doc = getDocsForProject(projectId).find((d) => d.id === docId);

  if (!doc) {
    notFound();
  }

  return (
    <section>
      <h2 className="font-display text-2xl text-ink">{doc.title}</h2>
      {doc.summary && (
        <p className="mt-2 text-sm text-muted-text">{doc.summary}</p>
      )}
      <div className="mt-8">
        <CollaborativeEditorPlaceholder />
      </div>
    </section>
  );
}
