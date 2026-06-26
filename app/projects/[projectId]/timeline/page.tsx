import { ActivityFeed } from "@/components/timeline/ActivityFeed";
import { getEventsForProject } from "@/lib/mock-data";

type TimelinePageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function TimelinePage({ params }: TimelinePageProps) {
  const { projectId } = await params;
  const events = getEventsForProject(projectId);

  return (
    <section>
      <h2 className="mb-2 font-display text-xl text-ink">Activity trail</h2>
      <p className="mb-6 text-sm text-muted-text">
        Project events from connected sources and manual updates. Realtime
        updates will stream here via Supabase.
      </p>
      <ActivityFeed events={events} />
    </section>
  );
}
