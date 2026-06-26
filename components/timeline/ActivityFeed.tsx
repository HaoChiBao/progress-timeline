import { SourceBadge } from "@/components/tickets/SourceBadge";
import type { ProjectEvent } from "@/lib/types/event";
import { cn } from "@/lib/utils";

type ActivityFeedProps = {
  events: ProjectEvent[];
  className?: string;
};

function formatRelativeTime(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ActivityFeed({ events, className }: ActivityFeedProps) {
  if (events.length === 0) {
    return (
      <p className="text-sm text-muted-text">No activity on the trail yet.</p>
    );
  }

  return (
    <ol className={cn("space-y-0", className)}>
      {events.map((event, index) => (
        <li
          key={event.id}
          className={cn(
            "relative border-l border-hairline pl-6 pb-6",
            index === events.length - 1 && "pb-0"
          )}
        >
          <span className="absolute -left-1.5 top-1.5 size-3 rounded-full border-2 border-canvas bg-primary" />
          <div className="rounded-lg border border-hairline bg-surface-card p-4">
            <div className="flex flex-wrap items-center gap-2">
              <SourceBadge source={event.source} />
              <time className="text-xs text-muted-soft">
                {formatRelativeTime(event.occurredAt)}
              </time>
            </div>
            <h3 className="mt-2 text-sm font-medium text-ink">{event.title}</h3>
            {event.summary && (
              <p className="mt-1 text-sm text-muted-text">{event.summary}</p>
            )}
            {event.actorName && (
              <p className="mt-2 text-xs text-muted-soft">{event.actorName}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
