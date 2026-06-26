"use client";

import { GrassTileField } from "@/components/timeline/GrassTileField";
import { TimelineEventMarker } from "@/components/timeline/TimelineEventMarker";
import type { ProjectEvent } from "@/lib/types/event";
import {
  eventRatio,
  GRASS_BAND_HEIGHT,
  GRASS_HORIZON_RATIO,
  TIMELINE_EVENT_OVERFLOW,
} from "@/lib/timeline/grass-path";
import { useMemo } from "react";

type GrassTimelineCanvasProps = {
  events: ProjectEvent[];
  width: number;
};

export function GrassTimelineCanvas({ events, width }: GrassTimelineCanvasProps) {
  const canvasHeight = GRASS_BAND_HEIGHT + TIMELINE_EVENT_OVERFLOW;
  const grassHorizon = GRASS_BAND_HEIGHT * GRASS_HORIZON_RATIO;

  const eventsKey = useMemo(
    () => events.map((e) => `${e.id}:${e.occurredAt}`).join("|"),
    [events]
  );

  const sortedEvents = useMemo(
    () =>
      [...events].sort(
        (a, b) =>
          new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime()
      ),
    [eventsKey]
  );

  return (
    <div
      className="relative shrink-0 overflow-visible"
      style={
        {
          width,
          minWidth: width,
          height: canvasHeight,
          "--grass-horizon": `${grassHorizon}px`,
        } as React.CSSProperties
      }
    >
      <div className="absolute inset-x-0 bottom-0">
        <GrassTileField width={width} />
      </div>

      {sortedEvents.map((event, index) => (
        <TimelineEventMarker
          key={event.id}
          event={event}
          x={eventRatio(index, sortedEvents.length) * width}
          index={index}
        />
      ))}
    </div>
  );
}
