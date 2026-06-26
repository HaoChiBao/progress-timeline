"use client";

import { GrassTimelineCanvas } from "@/components/timeline/GrassTimelineCanvas";
import type { ProjectEvent } from "@/lib/types/event";
import {
  computeTimelineWidth,
  TIMELINE_DEFAULT_ZOOM,
  TIMELINE_MAX_ZOOM,
  TIMELINE_MIN_ZOOM,
} from "@/lib/timeline/grass-path";
import { cn } from "@/lib/utils";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

type GrassTimelineProps = {
  events: ProjectEvent[];
  className?: string;
};

function clampZoom(value: number) {
  return Math.min(TIMELINE_MAX_ZOOM, Math.max(TIMELINE_MIN_ZOOM, value));
}

export function GrassTimeline({ events, className }: GrassTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const pendingScrollRef = useRef<number | null>(null);
  const hasInitialScrolledRef = useRef(false);
  const [zoom, setZoom] = useState(TIMELINE_DEFAULT_ZOOM);

  const baseWidth = useMemo(
    () => computeTimelineWidth(events.length, 1200, 1),
    [events.length]
  );
  const width = useMemo(
    () => computeTimelineWidth(events.length, 1200, zoom),
    [events.length, zoom]
  );

  useLayoutEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    if (container.scrollWidth <= container.clientWidth) {
      container.scrollLeft = 0;
    }
  }, [width, zoom]);

  useLayoutEffect(() => {
    const container = scrollRef.current;
    if (!container || pendingScrollRef.current === null) return;
    container.scrollLeft = pendingScrollRef.current;
    pendingScrollRef.current = null;
  }, [zoom, width]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || hasInitialScrolledRef.current) return;

    const scrollToEnd = () => {
      if (container.scrollWidth <= container.clientWidth) {
        hasInitialScrolledRef.current = true;
        return;
      }
      container.scrollTo({
        left: container.scrollWidth - container.clientWidth,
        behavior: "smooth",
      });
      hasInitialScrolledRef.current = true;
    };

    const timer = window.setTimeout(scrollToEnd, 300);
    return () => window.clearTimeout(timer);
  }, [baseWidth, events.length]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        const rect = container.getBoundingClientRect();
        const pointerX = event.clientX - rect.left;
        const contentWidth = container.scrollWidth;
        const focalPoint = container.scrollLeft + pointerX;
        const focalRatio = contentWidth > 0 ? focalPoint / contentWidth : 0;

        setZoom((currentZoom) => {
          const zoomFactor = Math.exp(-event.deltaY * 0.002);
          const nextZoom = clampZoom(currentZoom * zoomFactor);
          pendingScrollRef.current =
            focalRatio * baseWidth * nextZoom - pointerX;
          return nextZoom;
        });
        return;
      }

      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;
      if (delta === 0) return;
      if (container.scrollWidth <= container.clientWidth) return;

      event.preventDefault();
      container.scrollLeft += delta;
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [baseWidth]);

  if (events.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-8">
        <p className="text-sm text-muted-text">
          No events on the trail yet. Activity will appear here as your project
          progresses.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className={cn(
        "timeline-scroll relative flex min-h-[calc(100vh-7rem)] w-full min-w-0 flex-1 items-center overflow-x-auto overflow-y-hidden overscroll-x-contain",
        className
      )}
    >
      <div className="flex w-max min-w-full shrink-0 items-center justify-center">
        <GrassTimelineCanvas events={events} width={width} />
      </div>

      <p className="pointer-events-none absolute bottom-32 left-0 right-0 text-center text-xs text-muted-soft">
        Scroll to move along the field · Hold Ctrl and scroll to widen or slim
      </p>
    </div>
  );
}
