import type { ReactNode } from "react";
import Link from "next/link";

/** Server-safe building blocks for the admin pages: header, stat tiles, dense tables. */

export function PageHead({
  eyebrow,
  title,
  sub,
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-4 sm:mb-5">
      <div className="min-w-0">
        <div className="eyebrow mb-2">{eyebrow}</div>
        <h1 className="display text-3xl sm:text-4xl">{title}</h1>
        {sub && <p className="mt-2 text-sm text-ink-3 max-w-2xl leading-relaxed">{sub}</p>}
      </div>
      {aside}
    </div>
  );
}

export function Stat({
  label,
  value,
  hint,
  tone = "text-ink",
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: string;
}) {
  return (
    <div className="slab p-4 sm:p-5 min-w-0">
      <div className="eyebrow truncate">{label}</div>
      <div className={`mt-2 font-mono text-2xl sm:text-3xl tabular-nums tracking-tight ${tone}`}>{value}</div>
      {hint && <div className="mt-1 text-xs text-ink-3 leading-snug">{hint}</div>}
    </div>
  );
}

export function Table({ children, minWidth = 720 }: { children: ReactNode; minWidth?: number }) {
  return (
    <div className="slab overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse" style={{ minWidth }}>
          {children}
        </table>
      </div>
    </div>
  );
}

export function Th({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return (
    <th className={`text-left eyebrow font-normal px-4 py-3 border-b border-line whitespace-nowrap ${className}`}>
      {children}
    </th>
  );
}

export function Td({
  children,
  className = "",
  mono = false,
  title,
}: {
  children?: ReactNode;
  className?: string;
  mono?: boolean;
  title?: string;
}) {
  return (
    <td
      title={title}
      className={`px-4 py-3 border-b border-line/60 align-top text-ink-2 ${
        mono ? "font-mono text-xs tabular-nums whitespace-nowrap" : ""
      } ${className}`}
    >
      {children}
    </td>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="slab p-8 sm:p-10 text-center text-sm text-ink-3">{children}</div>;
}

const TONE: Record<string, string> = {
  paid: "tag-clear",
  active: "tag-clear",
  replied: "tag-clear",
  processed: "tag-clear",
  pass: "tag-clear",
  refunded: "tag-alert",
  failed: "tag-alert",
  canceled: "tag-alert",
  spam: "tag-alert",
  error: "tag-alert",
  fail: "tag-alert",
  new: "tag-signal",
  pending: "tag-signal",
  past_due: "tag-signal",
  unlocked: "tag-clear",
};

export function StatusTag({ status, label }: { status: string; label?: string }) {
  const cls = TONE[status] ?? "";
  return <span className={`tag ${cls}`}>{label ?? status.replace(/_/g, " ")}</span>;
}

/** Row of pill links used for list filters (unresolved / all, etc). */
export function FilterPills({
  items,
}: {
  items: { href: string; label: string; active: boolean; count?: number }[];
}) {
  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter">
      {items.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          aria-current={it.active ? "page" : undefined}
          className={`inline-flex items-center gap-2 min-h-11 px-4 rounded-full text-sm transition-colors ${
            it.active ? "bg-white/[0.08] text-ink" : "text-ink-2 hover:text-ink hover:bg-white/[0.05] active:bg-white/[0.08]"
          }`}
        >
          {it.label}
          {typeof it.count === "number" && <span className="font-mono text-xs text-ink-3 tabular-nums">{it.count}</span>}
        </Link>
      ))}
    </div>
  );
}
