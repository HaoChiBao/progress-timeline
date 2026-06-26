import { DocCard } from "@/components/docs/DocCard";
import type { Doc } from "@/lib/types/doc";

type DocListProps = {
  docs: Doc[];
  projectId: string;
};

export function DocList({ docs, projectId }: DocListProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {docs.map((doc) => (
        <DocCard key={doc.id} doc={doc} projectId={projectId} />
      ))}
    </div>
  );
}
