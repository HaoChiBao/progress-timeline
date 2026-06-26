export const TIMELINE_EVENT_SPACING = 300;
export const TIMELINE_PADDING = 0;

export const GRASS_TILE_NATIVE_WIDTH = 1774;
export const GRASS_TILE_NATIVE_HEIGHT = 887;
export const GRASS_BAND_HEIGHT = 340;

export const GRASS_TILE_DISPLAY_WIDTH =
  GRASS_TILE_NATIVE_WIDTH *
  (GRASS_BAND_HEIGHT / GRASS_TILE_NATIVE_HEIGHT);

export function computeTimelineWidth(
  eventCount: number,
  minWidth = 1200,
  scale = 1
): number {
  const contentWidth =
    TIMELINE_PADDING * 2 + Math.max(eventCount - 1, 0) * TIMELINE_EVENT_SPACING;
  return Math.max(minWidth, contentWidth) * scale;
}

export const TIMELINE_MIN_ZOOM = 0.5;
export const TIMELINE_MAX_ZOOM = 2.5;
export const TIMELINE_DEFAULT_ZOOM = 1;

/** Where the grass meets open sky inside the tile image (0–1 from top). */
export const GRASS_HORIZON_RATIO = 0.48;

/** Space above the grass band for event cards. */
export const TIMELINE_EVENT_OVERFLOW = 140;

export function eventRatio(index: number, total: number): number {
  if (total <= 1) return 0.5;
  const inset = 0.05;
  return inset + (index / (total - 1)) * (1 - inset * 2);
}
