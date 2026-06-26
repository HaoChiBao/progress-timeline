import { EmptyState } from "@/components/layout/EmptyState";
import { FileText } from "lucide-react";

export function CollaborativeEditorPlaceholder() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-hairline bg-surface-dark p-6 text-on-dark">
        <p className="font-mono text-sm text-on-dark-soft">
          {"// Collaborative editor scaffold"}
        </p>
        <p className="mt-4 font-mono text-sm leading-relaxed text-on-dark">
          Liveblocks + Yjs room wiring will connect here.
          <br />
          For now, this dark surface marks the product editing zone.
        </p>
      </div>
      <EmptyState
        icon={FileText}
        title="Editor coming soon"
        description="Real-time collaborative docs with presence and shared cursors will land in a follow-up ticket."
      />
    </div>
  );
}
