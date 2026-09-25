import type { ReactNode } from "react";

/**
 * Shared header for landing sections: mono eyebrow, serif display headline
 * (pass exactly one <em> for the accent word), optional one-paragraph intro.
 */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  className = "",
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div className={`${centered ? "text-center mx-auto" : ""} max-w-2xl ${className}`}>
      <div className="eyebrow mb-3">{eyebrow}</div>
      <h2 className="display text-[2.1rem] leading-[1.02] sm:text-5xl">{title}</h2>
      {intro && <p className="mt-4 text-ink-2 text-base sm:text-lg leading-relaxed">{intro}</p>}
    </div>
  );
}
