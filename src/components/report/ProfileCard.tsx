import type { ProfileStat } from "@/lib/report/profile";

/** "Your numbers": the intake read back, in one slab. */
export function ProfileCard({ stats, compact = false }: { stats: ProfileStat[]; compact?: boolean }) {
  if (stats.length === 0) return null;
  return (
    <div className={`slab ${compact ? "p-5 sm:p-6" : "p-6 sm:p-8"} animate-rise`} style={{ animationDelay: "40ms" }}>
      <div className="eyebrow mb-3">Your numbers</div>
      <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-0.5 border-b border-line pb-3 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0">
            <dt className="text-[11px] font-mono uppercase tracking-[0.12em] text-ink-3">{s.label}</dt>
            <dd className="font-display text-xl sm:text-2xl font-bold text-ink leading-tight">{s.value}</dd>
            {s.note && <dd className="text-xs text-ink-3 leading-snug">{s.note}</dd>}
          </div>
        ))}
      </dl>
    </div>
  );
}
