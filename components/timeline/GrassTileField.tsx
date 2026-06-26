"use client";

import {
  GRASS_BAND_HEIGHT,
  GRASS_TILE_DISPLAY_WIDTH,
} from "@/lib/timeline/grass-path";

type GrassTileFieldProps = {
  width: number;
};

export function GrassTileField({ width }: GrassTileFieldProps) {
  return (
    <div
      className="pointer-events-none overflow-hidden"
      style={{
        width,
        height: GRASS_BAND_HEIGHT,
        backgroundImage: "url(/textures/grass-tile.png)",
        backgroundRepeat: "repeat-x",
        backgroundSize: `${GRASS_TILE_DISPLAY_WIDTH}px ${GRASS_BAND_HEIGHT}px`,
        backgroundPosition: "left bottom",
      }}
      aria-hidden
    />
  );
}
