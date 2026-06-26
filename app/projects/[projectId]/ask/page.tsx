import { EmptyState } from "@/components/layout/EmptyState";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

export default function AskPage() {
  return (
    <section>
      <h2 className="font-display text-xl text-ink">Ask ProgressGoat</h2>
      <p className="mt-1 text-sm text-muted-text">
        Query project memory, summaries, and decision logs with AI.
      </p>

      <div className="mt-8">
        <EmptyState
          icon={MessageSquare}
          title="Project memory coming soon"
          description="Goat is reading project events… AI-powered Q&A over your timeline, docs, and integrations will land in a later ticket."
          action={
            <Button disabled>Start a conversation</Button>
          }
        />
      </div>
    </section>
  );
}
