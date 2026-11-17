import { memo } from "react";
import lushGarden from "@/assets/oxten-garden-lush.jpg";
import bareGarden from "@/assets/oxten-garden-bare.png";

// The two paintings share pixels outside these exact edited planting regions.
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
      <svg className="garden-canvas" viewBox="0 0 1024 1200" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="painted-edge" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency=".024 .08"
              numOctaves="3"
              seed="12"
              result="grain"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="grain"
              scale="22"
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <feGaussianBlur stdDeviation="4" />
          </filter>
          <filter id="growing-edge" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency=".028"
              numOctaves="2"
              seed="5"
              result="grain"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="grain"
              scale="18"
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <mask
            id="painted-paper-edge"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="1024"
            height="1920"
          >
            <path
              className="mask-paper"
              filter="url(#painted-edge)"
              d="M160 12 L125 55 148 110 108 170 126 235 99 294 123 350 90 420 117 490 94 560 108 620 83 694 111 753 91 820 105 890 76 950 105 1015 80 1090 109 1150 90 1220 113 1290 83 1360 112 1430 91 1510 118 1585 103 1650 133 1710 113 1780 154 1850 225 1900 L850 1900 923 1830 938 100 874 16 Z"
            />
          </mask>
          {beds.map((bed, i) => (
            <g key={i}>
              <clipPath id={`bed-area-${i}`}>
                <rect x={bed.x} y={bed.y} width={bed.width} height={bed.height} rx="20" />
              </clipPath>
              <mask
                id={`bed-growth-${i}`}
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="1024"
                height="1920"
              >
                <g clipPath={`url(#bed-area-${i})`}>
                  <circle
                    className={`growth-circle growth-${i} mask-paper`}
                    cx={bed.x + bed.width / 2}
                    cy={bed.y + bed.height / 2}
                    r="400"
                    filter="url(#growing-edge)"
                  />
                </g>
              </mask>
            </g>
          ))}
        </defs>
        <g className="garden-camera" transform="translate(560 650) rotate(-5) scale(1.08)">
          <g transform="translate(-512 -960)" mask="url(#painted-paper-edge)">
            <image href={bareGarden} width="1024" height="1920" />
            {beds.map((_, i) => (
              <image
                key={i}
                href={lushGarden}
                width="1024"
                height="1920"
                mask={`url(#bed-growth-${i})`}
              />
            ))}
            <image className="hero-lush" href={lushGarden} width="1024" height="1920" />
          </g>
        </g>
      </svg>
    </div>
  );
});
