import type { CSSProperties } from "react";
import lushGarden from "@/assets/garden-lush.webp";
import bareGarden from "@/assets/garden-bare.webp";

// Regions are measured on the 3072 x 5504 master painting.
const W = 3072;
const H = 5504;

// Regions of the painting, in painting pixels. The painting is portrait and is shown lying
// on its side, so a region's height becomes its width on screen.
export type Region = { x: number; y: number; width: number; height: number };

export const plots: Region[] = [
  { x: 800, y: 1680, width: 588, height: 1848 },
  { x: 1690, y: 1684, width: 568, height: 1848 },
  { x: 806, y: 3040, width: 564, height: 1824 },
  { x: 1700, y: 540, width: 552, height: 1800 },
];
export const wholeGarden: Region = { x: 170, y: 30, width: 2730, height: 5444 };

const pct = (value: number) => `${(value * 100).toFixed(3)}%`;

function crop(region: Region, image: string): CSSProperties {
  return {
    backgroundImage: `url(${image})`,
    backgroundSize: `${pct(W / region.width)} ${pct(H / region.height)}`,
    backgroundPosition: `${pct(region.x / (W - region.width))} ${pct(region.y / (H - region.height))}`,
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
