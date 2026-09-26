import Link from "next/link";

/**
 * The LiftDecode mark: a dumbbell laid on the 45° diagonal, cut from flat stock.
 * Two hexagonal heads and a handle, every edge at 0°, 45° or 90° with sharp corners
 * (stamped steel, not rounded plastic). A pure graphic: it never contains letters,
 * and the brand name is never drawn into it.
 *
 * Geometry (64-unit grid) comes from `mark({ m: 4, a: 11, g: 4, w: 8 })`:
 * m = margin, a = head weight, g = stencil gap between head and handle, w = handle half-width.
 *
 * - GAPPED (28px and up): the stencil gaps separate the handle from the heads.
 * - SOLID (below 28px, monochrome only): g = -1 pushes the handle one unit into each head; the subpaths
 *   wind the same way, so the nonzero fill is one clean silhouette that does not smear to grey.
 *
 * Colour: monochrome `currentColor` by default. The one allowed accent is the handle alone in
 * amber (--color-signal) with ink heads — used in the header tile, icon.svg and apple-icon only.
 * Never the bumper-plate colours.
 */
export const MARK_HEADS = "M4 32H15L32 49V60H21L4 43ZM32 4H43L60 21V32H49L32 15Z";
export const MARK_HANDLE = "M21.5 34.5L34.5 21.5L42.5 29.5L29.5 42.5Z";
export const MARK_HANDLE_SOLID = "M19 37L37 19L45 27L27 45Z";

export function LogoMark({
  size = 28,
  className = "",
  accent = false,
}: {
  size?: number;
  className?: string;
  /** Ink heads + amber handle. Only for the header tile; everywhere else stays monochrome. */
  accent?: boolean;
}) {
  // The accent's colour split already separates the handle at small sizes, so it keeps the gaps.
  const solid = size < 28 && !accent;
  const handle = solid ? MARK_HANDLE_SOLID : MARK_HANDLE;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {accent ? (
        <>
          <path fill="var(--color-ink, #f3f2ee)" d={MARK_HEADS} />
          <path fill="var(--color-signal, #f5b544)" d={handle} />
        </>
      ) : (
        <path fill="currentColor" d={MARK_HEADS + handle} />
      )}
    </svg>
  );
}

/**
 * Live-text brand name, set in the display face. It sits beside the mark where a page needs the
 * name spelled out, and is never part of the mark itself. The header and footer show the mark alone.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-extrabold uppercase tracking-[0.02em] leading-none ${className}`}>
      Lift<span className="text-signal">Decode</span>
    </span>
  );
}

export function LogoLink({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="LiftDecode home"
      className={`group inline-grid place-items-center min-w-11 min-h-11 rounded-[14px] ${className}`}
    >
      <span className="grid place-items-center w-9 h-9 rounded-[12px] bg-slab border border-line transition-[transform,border-color] duration-150 group-hover:border-line-2 group-active:scale-[0.92]">
        <LogoMark size={24} accent />
      </span>
    </Link>
  );
}
