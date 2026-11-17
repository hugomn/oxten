import { memo } from "react";
import lushGarden from "@/assets/oxten-garden-lush.jpg";
import bareGarden from "@/assets/oxten-garden-bare.png";

// The two paintings share pixels outside these planting regions, in painting pixels.
const beds = [
  { x: 285, y: 207, width: 155, height: 304 },
  { x: 605, y: 207, width: 152, height: 304 },
  { x: 285, y: 602, width: 151, height: 590 },
  { x: 605, y: 602, width: 149, height: 590 },
  { x: 284, y: 1310, width: 154, height: 341 },
  { x: 606, y: 1310, width: 148, height: 341 },
];

export const Garden = memo(function Garden() {
  return (
    <div className="garden-stage" aria-hidden="true">
      <div className="garden-camera">
        <div className="garden-art">
          <img src={bareGarden} width={1024} height={1920} alt="" />
          {beds.map((bed, i) => (
            <div
              key={i}
              className={`bed bed-${i}`}
              style={{
                left: bed.x,
                top: bed.y,
                width: bed.width,
                height: bed.height,
                backgroundImage: `url(${lushGarden})`,
                backgroundPosition: `-${bed.x}px -${bed.y}px`,
              }}
            />
          ))}
          <img className="hero-lush" src={lushGarden} width={1024} height={1920} alt="" />
          <div className="cloud-shadows" />
        </div>
      </div>
      <div className="garden-grain" />
    </div>
  );
});
