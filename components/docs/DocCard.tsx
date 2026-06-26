import type { Doc } from "@/lib/types/doc";
import Link from "next/link";

type DocCardProps = {
  doc: Doc;
  projectId: string;
};

export function DocCard({ doc, projectId }: DocCardProps) {
  return (
    <Link
      href={`/projects/${projectId}/docs/${doc.id}`}
      className="block rounded-lg border border-hairline bg-surface-card p-5 transition-colors hover:border-[#6f7c5d]/30 hover:bg-[#dde3d2]/40"
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-sans text-base font-medium text-ink">{doc.title}</h3>
        <span className="shrink-0 rounded-full border border-hairline bg-canvas px-2 py-0.5 text-xs capitalize text-muted-text">
          {doc.status}
        </span>
      </div>
      {doc.summary && (
        <p className="mt-2 line-clamp-2 text-sm text-muted-text">{doc.summary}</p>
      )}
      <p className="mt-4 text-xs text-muted-soft">
        Updated {new Date(doc.updatedAt).toLocaleDateString()}
        {doc.authorName ? ` · ${doc.authorName}` : ""}
      </p>
    </Link>
  );
}
