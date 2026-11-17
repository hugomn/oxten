import type { CSSProperties } from "react";
import lushGarden from "@/assets/oxten-garden-lush.jpg";
import bareGarden from "@/assets/oxten-garden-bare.png";

const W = 1024;
const H = 1920;

// Regions of the painting, in painting pixels. The painting is portrait and is shown lying
// on its side, so a region's height becomes its width on screen.
export type Region = { x: number; y: number; width: number; height: number };

export const plots: Region[] = [
  { x: 285, y: 602, width: 151, height: 590 },
  { x: 605, y: 602, width: 149, height: 590 },
  { x: 284, y: 1085, width: 154, height: 600 },
  { x: 605, y: 190, width: 152, height: 600 },
];
export const wholeGarden: Region = { x: 108, y: 56, width: 808, height: 1808 };

function crop(region: Region, image: string): CSSProperties {
  return {
    backgroundImage: `url(${image})`,
    backgroundSize: `${(W / region.width) * 100}% ${(H / region.height) * 100}%`,
    backgroundPosition: `${(region.x / (W - region.width)) * 100}% ${(region.y / (H - region.height)) * 100}%`,
  };
}

// One piece of the garden. With `plantable`, it starts as the bare plan and is planted
// (bare to lush, swept along its length) when its work is done.
export function Plot({
  region,
  plantable = false,
  className = "",
}: {
  region: Region;
  plantable?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`plot ${className}`}
      style={{ aspectRatio: `${region.height} / ${region.width}` }}
      aria-hidden="true"
    >
      <div className="plot-turn">
        {plantable && <div className="plot-layer" style={crop(region, bareGarden)} />}
        <div
          className={`plot-layer ${plantable ? "plot-lush" : ""}`}
          style={crop(region, lushGarden)}
        />
      </div>
    </div>
  );
}
