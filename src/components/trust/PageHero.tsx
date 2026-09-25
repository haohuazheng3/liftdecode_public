import type { ReactNode } from "react";

/** Top slab of a marketing / trust page: mono eyebrow, serif headline with one accent word, one-paragraph lede. */
export function PageHero({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  /** pass the headline with exactly one <em> */
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="slab p-6 sm:p-10 animate-rise">
      <div className="eyebrow mb-3">{eyebrow}</div>
      <h1 className="display text-4xl sm:text-6xl max-w-3xl">{title}</h1>
      {lede && <p className="mt-4 text-ink-2 text-lg max-w-2xl leading-relaxed">{lede}</p>}
      {children}
    </div>
  );
}
