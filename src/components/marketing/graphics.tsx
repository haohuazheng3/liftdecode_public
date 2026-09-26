import type { ReactNode } from "react";
import { PLATE } from "./Barbell";

/* ------------------------------------------------------------------
   Custom inline-SVG fitness icons (24px grid, 1.75 stroke, currentColor).
   All decorative: the text next to each icon carries the meaning.
------------------------------------------------------------------- */

export type IconName =
  | "effort"
  | "progression"
  | "volume"
  | "programme"
  | "technique"
  | "sleep"
  | "food"
  | "recovery"
  | "consistency"
  | "stress"
  | "cardio"
  | "timeline";

const ICON_PATHS: Record<IconName, ReactNode> = {
  // a flame: how hard the last reps really are
  effort: (
    <>
      <path d="M12 2.8c.6 3.1 4.9 5.1 4.9 10.1a4.9 4.9 0 0 1-9.8 0c0-2.3 1.1-3.8 2.3-4.8.1 1.8.9 3 2 3.3-.6-3.1.1-5.6.6-8.6Z" />
      <path d="M12 21.2a2.2 2.2 0 0 1-2.2-2.2c0-1.4 1.2-2.2 2.2-3.6 1 1.4 2.2 2.2 2.2 3.6a2.2 2.2 0 0 1-2.2 2.2Z" />
    </>
  ),
  // a plate with an arrow climbing across it
  progression: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <circle cx="12" cy="12" r="2" />
      <path d="M7.6 16.4 16.4 7.6M11.4 7.6h5v5" />
    </>
  ),
  // plates stacked on a sleeve: how many hard sets
  volume: (
    <>
      <path d="M3 12h18" />
      <rect x="5" y="6" width="3" height="12" rx="1" />
      <rect x="9" y="4" width="3" height="16" rx="1" />
      <rect x="16" y="7.5" width="3" height="9" rx="1" />
    </>
  ),
  // a clipboard programme
  programme: (
    <>
      <rect x="5" y="4.5" width="14" height="16.5" rx="2.5" />
      <path d="M9 4.5V3.4c0-.5.4-.9.9-.9h4.2c.5 0 .9.4.9.9v1.1M8.5 10h7M8.5 13.5h7M8.5 17h4" />
    </>
  ),
  // a joint moving through its full range
  technique: (
    <>
      <circle cx="7" cy="17" r="1.8" />
      <path d="M8.8 17H20M8.1 15.6l6.4-9" />
      <path d="M17.5 9.6a9 9 0 0 1 1.8 5.4" strokeDasharray="1.6 2.2" />
    </>
  ),
  // moon and a couple of z's
  sleep: (
    <>
      <path d="M19.2 14.6A7.7 7.7 0 1 1 10.4 4a6.2 6.2 0 0 0 8.8 10.6Z" />
      <path d="M15 3.5h3.5L15 7h3.5" />
    </>
  ),
  // fork and knife
  food: (
    <>
      <path d="M7 3v18M4.5 3v4.5a2.5 2.5 0 0 0 5 0V3" />
      <path d="M17.5 21V3c-2.3 1.4-3.3 4.4-3.3 7.6 0 1.5.8 2.4 3.3 2.4" />
    </>
  ),
  // a battery that never refills
  recovery: (
    <>
      <rect x="3" y="7" width="16" height="10" rx="2.4" />
      <path d="M21 10.5v3" />
      <path d="M6 10v4" strokeWidth="2.6" />
    </>
  ),
  // calendar with a check
  consistency: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
      <path d="m9 14.8 2 2 4-4" />
    </>
  ),
  // a gauge in the red
  stress: (
    <>
      <path d="M3.6 16.5a8.6 8.6 0 1 1 16.8 0" />
      <path d="M12 15.5 17 9.2" />
      <circle cx="12" cy="15.8" r="1.4" />
      <path d="M6.4 11.6h.01M9 8.4h.01" strokeWidth="2.4" />
    </>
  ),
  // heart with a pulse line
  cardio: (
    <>
      <path d="M12 20s-7.8-4.6-7.8-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.8 2.6C19.8 15.4 12 20 12 20Z" />
      <path d="M4.5 12.5h4l1.6-2.6 2.2 4.8 1.5-2.2h5.7" />
    </>
  ),
  // hourglass
  timeline: (
    <>
      <path d="M6 3h12M6 21h12" />
      <path d="M7.5 3c0 5 9 5 9 9s-9 4-9 9M16.5 3c0 5-9 5-9 9s9 4 9 9" />
    </>
  ),
};

export function FitIcon({ name, size = 24, className = "" }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

/* ------------------------------------------------------------------
   Gym-signage pictograms for the two tracks (solid, 120px grid).
------------------------------------------------------------------- */

/** Physique: a front double-biceps pose with a V-taper. */
export function PhysiquePictogram({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true" focusable="false">
      <g fill="currentColor">
        <circle cx="60" cy="22" r="10.5" />
        {/* V-taper torso */}
        <path d="M37 38c0-2.2 1.8-4 4-4h38c2.2 0 4 1.8 4 4l-9 40c-.4 1.7-1.9 3-3.7 3H49.7c-1.8 0-3.3-1.3-3.7-3L37 38Z" />
      </g>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {/* arms: upper arm out, forearm up — the flex */}
        <path d="M41 40 22 46 20 22" strokeWidth="10" />
        <path d="M79 40 98 46 100 22" strokeWidth="10" />
        {/* legs */}
        <path d="M52 80 46 111M68 80 74 111" strokeWidth="11" />
      </g>
      {/* peaked biceps */}
      <g fill="currentColor">
        <circle cx="28" cy="37" r="7.5" />
        <circle cx="92" cy="37" r="7.5" />
      </g>
    </svg>
  );
}

/** Strength: a lifter locking out a loaded barbell overhead. */
export function StrengthPictogram({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true" focusable="false">
      {/* bar and plates */}
      <rect x="8" y="14" width="104" height="5" rx="2.5" fill="currentColor" />
      <rect x="10" y="3" width="9" height="27" rx="2.5" fill={PLATE.red} />
      <rect x="101" y="3" width="9" height="27" rx="2.5" fill={PLATE.red} />
      <rect x="21" y="7" width="5" height="19" rx="2" fill={PLATE.blue} />
      <rect x="94" y="7" width="5" height="19" rx="2" fill={PLATE.blue} />
      <g fill="currentColor">
        <circle cx="60" cy="42" r="9.5" />
        <path d="M45 57c0-2.2 1.8-4 4-4h22c2.2 0 4 1.8 4 4l-4 27c-.3 1.9-1.9 3.2-3.8 3.2H52.8c-1.9 0-3.5-1.3-3.8-3.2L45 57Z" />
      </g>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M48 57 38 18M72 57l10-39" strokeWidth="9" />
        <path d="M54 86 44 113M66 86l10 27" strokeWidth="10.5" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------
   A bumper plate seen face-on. Decorative background motif.
------------------------------------------------------------------- */

export function PlateFace({
  className = "",
  fill = PLATE.red,
  label = "25",
  outline = false,
}: {
  className?: string;
  fill?: string;
  label?: string;
  /** hairline version for quiet backgrounds */
  outline?: boolean;
}) {
  if (outline) {
    return (
      <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false" fill="none">
        <circle cx="100" cy="100" r="97" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="86" stroke="currentColor" strokeWidth="1" strokeDasharray="2 5" />
        <circle cx="100" cy="100" r="58" stroke="currentColor" strokeWidth="1" />
        <circle cx="100" cy="100" r="22" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="12" stroke="currentColor" strokeWidth="1" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false">
      <circle cx="100" cy="100" r="98" fill={fill} />
      <circle cx="100" cy="100" r="98" fill="url(#ld-face-shade)" />
      <circle cx="100" cy="100" r="86" fill="none" stroke="#000" strokeOpacity="0.22" strokeWidth="3" />
      <circle cx="100" cy="100" r="60" fill="none" stroke="#000" strokeOpacity="0.14" strokeWidth="2" />
      <circle cx="100" cy="100" r="24" fill="#b9b9c0" />
      <circle cx="100" cy="100" r="24" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="13" fill="#08080b" />
      <text
        x="100"
        y="54"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#fff"
        fillOpacity="0.9"
        style={{ fontFamily: "var(--font-stencil)", fontSize: 30, letterSpacing: "0.04em" }}
      >
        {label}
      </text>
      <text
        x="100"
        y="150"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#fff"
        fillOpacity="0.75"
        style={{ fontFamily: "var(--font-stencil)", fontSize: 18, letterSpacing: "0.2em" }}
      >
        KG
      </text>
      <defs>
        <radialGradient id="ld-face-shade" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.35" />
        </radialGradient>
      </defs>
    </svg>
  );
}
