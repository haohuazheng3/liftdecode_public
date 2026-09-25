import Link from "next/link";

/**
 * The LiftDecode mark: a bar held between two brackets — a barbell seen head-on,
 * and a token being decoded. Monochrome, legible at 16px, works as a favicon.
 */
export function LogoMark({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M22 16H13V48H22"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M42 16H51V48H42"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M25 32H39" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-semibold tracking-[-0.02em] ${className}`}>
      Lift<span className="text-signal">Decode</span>
    </span>
  );
}

export function LogoLink({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="LiftDecode home"
      className={`inline-flex items-center gap-2.5 text-ink hover:opacity-90 transition-opacity ${className}`}
    >
      <span className="grid place-items-center w-9 h-9 rounded-[12px] bg-ink text-void">
        <LogoMark size={22} />
      </span>
      <Wordmark className="text-[1.05rem]" />
    </Link>
  );
}
