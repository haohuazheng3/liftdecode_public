import type { ReactNode } from "react";

/**
 * Shared header for landing sections: mono eyebrow with a short amber rule,
 * condensed caps display headline (pass exactly one <em> for the amber word),
 * optional one-line intro.
 */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  className = "",
  id,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  className?: string;
  /** id for the <h2>, so the section can be aria-labelledby it */
  id?: string;
}) {
  const centered = align === "center";
  return (
    <div className={`${centered ? "text-center mx-auto" : ""} max-w-3xl ${className}`}>
      <div className={`eyebrow mb-3 flex items-center gap-2.5 ${centered ? "justify-center" : ""}`}>
        <span className="h-[3px] w-6 rounded-full bg-signal" aria-hidden="true" />
        {eyebrow}
      </div>
      <h2 id={id} className="display display-caps text-[2.6rem] sm:text-6xl lg:text-7xl">{title}</h2>
      {intro && <p className={`mt-4 text-ink-2 text-base sm:text-lg leading-relaxed max-w-2xl ${centered ? "mx-auto" : ""}`}>{intro}</p>}
    </div>
  );
}
