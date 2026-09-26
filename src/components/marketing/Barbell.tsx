import type { CSSProperties } from "react";

/**
 * Hero illustration: a loaded barbell on a lifting platform, side view.
 * Competition bumper colours (red → blue → yellow → green → white change plate),
 * knurled grip, spring collars. Plates slide onto the sleeves one after another
 * on load; a little chalk puffs up when they land. Pure inline SVG, decorative.
 */

/** competition bumper colours — illustrations only, never UI chrome */
export const PLATE = {
  red: "#D8403A",
  blue: "#2E6BD6",
  yellow: "#EFC030",
  green: "#2E9E62",
  white: "#EDEDED",
} as const;

type Plate = { x: number; w: number; fill: string; small?: boolean; clamp?: boolean };

// left side, from the inner collar outward (x grows toward the centre)
const LEFT: Plate[] = [
  { x: 140, w: 34, fill: PLATE.red },
  { x: 108, w: 30, fill: PLATE.blue },
  { x: 80, w: 26, fill: PLATE.yellow },
  { x: 58, w: 20, fill: PLATE.green },
  { x: 46, w: 10, fill: PLATE.white, small: true },
  { x: 32, w: 12, fill: "url(#ld-steel)", clamp: true },
];

const VIEW_W = 1000;
const CENTER_Y = 125;

function PlateShape({ p, side, i }: { p: Plate; side: "l" | "r"; i: number }) {
  const x = side === "l" ? p.x : VIEW_W - p.x - p.w;
  const h = p.clamp ? 42 : p.small ? 112 : 210;
  const y = CENTER_Y - h / 2;
  const style = {
    "--d": `${160 + i * 110}ms`,
    "--from": `${side === "l" ? -90 : 90}px`,
  } as CSSProperties;

  if (p.clamp) {
    return (
      <g className="plate-in" style={style}>
        <rect x={x} y={y} width={p.w} height={h} rx={3} fill={p.fill} />
        <rect x={x} y={y + 6} width={p.w} height={2} fill="#000" opacity={0.3} />
        <rect x={x} y={y + h - 8} width={p.w} height={2} fill="#000" opacity={0.3} />
      </g>
    );
  }

  return (
    <g className="plate-in" style={style}>
      <rect x={x} y={y} width={p.w} height={h} rx={6} fill={p.fill} />
      {/* cylinder shading so the plate reads as a thick rubber disc */}
      <rect x={x} y={y} width={p.w} height={h} rx={6} fill="url(#ld-plate-shade)" />
      {/* the moulded rim lip, top and bottom */}
      <rect x={x + 1} y={y + 12} width={p.w - 2} height={2.5} fill="#000" opacity={0.2} />
      <rect x={x + 1} y={y + h - 14.5} width={p.w - 2} height={2.5} fill="#000" opacity={0.2} />
      {/* steel hub insert */}
      <rect x={x + 2} y={CENTER_Y - 14} width={p.w - 4} height={28} rx={2} fill="url(#ld-steel)" opacity={0.7} />
    </g>
  );
}

export function Barbell({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1000 256"
      className={`block w-full h-auto ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="ld-steel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9e9ee" />
          <stop offset="0.45" stopColor="#a4a4ad" />
          <stop offset="0.55" stopColor="#8a8a93" />
          <stop offset="1" stopColor="#4b4b53" />
        </linearGradient>
        <linearGradient id="ld-plate-shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.38" />
        </linearGradient>
        <pattern id="ld-knurl" width="5" height="5" patternUnits="userSpaceOnUse">
          <path d="M0 5L5 0M-1 1L1-1M4 6L6 4" stroke="#000" strokeOpacity="0.5" strokeWidth="0.9" />
          <path d="M0 0L5 5M4-1L6 1M-1 4L1 6" stroke="#fff" strokeOpacity="0.25" strokeWidth="0.6" />
        </pattern>
        <radialGradient id="ld-floor-shadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.75" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <filter id="ld-chalk-blur" x="-1" y="-1" width="3" height="3">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* lifting platform */}
      <ellipse cx="500" cy="236" rx="470" ry="14" fill="url(#ld-floor-shadow)" />
      <rect x="0" y="232" width="1000" height="18" rx="9" fill="#17171d" />
      <rect x="250" y="232" width="500" height="18" fill="#221d17" />
      <rect x="0" y="232" width="1000" height="1.5" fill="#fff" opacity="0.07" />

      {/* the bar: shaft, knurled grips, inner collars, sleeves */}
      <g className="bar-in">
        <rect x="190" y="120" width="620" height="10" rx="2" fill="url(#ld-steel)" />
        <rect x="250" y="120" width="200" height="10" fill="url(#ld-knurl)" />
        <rect x="550" y="120" width="200" height="10" fill="url(#ld-knurl)" />
        <rect x="490" y="120" width="20" height="10" fill="url(#ld-knurl)" opacity="0.6" />
        <rect x="18" y="113" width="160" height="24" rx="4" fill="url(#ld-steel)" />
        <rect x="822" y="113" width="160" height="24" rx="4" fill="url(#ld-steel)" />
        <rect x="176" y="104" width="14" height="42" rx="3" fill="url(#ld-steel)" />
        <rect x="810" y="104" width="14" height="42" rx="3" fill="url(#ld-steel)" />
        <rect x="14" y="116" width="6" height="18" rx="2" fill="#5b5b63" />
        <rect x="980" y="116" width="6" height="18" rx="2" fill="#5b5b63" />
      </g>

      {LEFT.map((p, i) => (
        <PlateShape key={`l${i}`} p={p} side="l" i={i} />
      ))}
      {LEFT.map((p, i) => (
        <PlateShape key={`r${i}`} p={p} side="r" i={i} />
      ))}

      {/* chalk kicked up where the plates meet the platform */}
      <g fill="#fff" filter="url(#ld-chalk-blur)">
        <circle className="chalk-puff" cx="118" cy="226" r="11" style={{ "--d": "820ms" } as CSSProperties} />
        <circle className="chalk-puff" cx="168" cy="222" r="7" style={{ "--d": "900ms" } as CSSProperties} />
        <circle className="chalk-puff" cx="846" cy="224" r="10" style={{ "--d": "860ms" } as CSSProperties} />
        <circle className="chalk-puff" cx="890" cy="228" r="7" style={{ "--d": "960ms" } as CSSProperties} />
      </g>
    </svg>
  );
}
