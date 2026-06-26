import { PriorityPill } from "@/components/tickets/PriorityPill";
import { SourceBadge } from "@/components/tickets/SourceBadge";
import type { EventSource } from "@/lib/types/event";
import { cn } from "@/lib/utils";
import { Paperclip, User } from "lucide-react";

export type TicketCardProps = {
  title: string;
  summary?: string;
  priority?: "urgent" | "high" | "medium" | "low" | "none";
  status?: string;
  source?: EventSource;
  assignee?: string;
  artifactCount?: number;
  selected?: boolean;
  className?: string;
};

function formatStatus(status: string) {
  return status.replace(/_/g, " ");
}

export function TicketCard({
  title,
  summary,
  priority = "none",
  status,
  source,
  assignee,
  artifactCount,
  selected = false,
  className,
}: TicketCardProps) {
  return (
    <article
      className={cn(
        "rounded-lg border border-hairline bg-surface-card p-4 transition-colors",
        selected && "border-[#6f7c5d]/40 bg-[#dde3d2]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3
          className={cn(
            "font-sans text-base font-medium leading-snug text-ink",
            selected && "text-[#556246]"
          )}
        >
          {title}
        </h3>
        {priority !== "none" && <PriorityPill priority={priority} />}
      </div>

      {summary && (
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-text">
          {summary}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {source && <SourceBadge source={source} />}
        {status && (
          <span className="inline-flex items-center rounded-full border border-hairline bg-canvas px-2.5 py-0.5 text-xs font-medium capitalize text-muted-text">
            {formatStatus(status)}
          </span>
        )}
      </div>

      {(assignee || (artifactCount !== undefined && artifactCount > 0)) && (
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-soft">
          {assignee && (
            <span className="inline-flex items-center gap-1">
              <User className="size-3" />
              {assignee}
            </span>
          )}
          {artifactCount !== undefined && artifactCount > 0 && (
            <span className="inline-flex items-center gap-1">
              <Paperclip className="size-3" />
              {artifactCount} artifact{artifactCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}
    </article>
  );
}
