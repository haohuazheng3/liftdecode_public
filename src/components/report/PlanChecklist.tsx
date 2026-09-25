"use client";

import { useOptimistic, useState, useTransition } from "react";
import { togglePlanStep } from "@/app/report/[id]/actions";
import { track } from "@/components/Analytics";

export interface PlanWeek {
  week: number;
  items: { key: string; text: string; source: string }[];
}

export function PlanChecklist({
  assessmentId,
  weeks,
  done,
  canCheck,
}: {
  assessmentId: string;
  weeks: PlanWeek[];
  done: string[];
  canCheck: boolean;
}) {
  const [doneSet, setDoneSet] = useState<Set<string>>(() => new Set(done));
  const [optimistic, applyOptimistic] = useOptimistic(doneSet, (state, change: { key: string; done: boolean }) => {
    const next = new Set(state);
    if (change.done) next.add(change.key);
    else next.delete(change.key);
    return next;
  });
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggle(key: string) {
    if (!canCheck) return;
    const nextDone = !optimistic.has(key);
    setError(null);
    startTransition(async () => {
      applyOptimistic({ key, done: nextDone });
      const r = await togglePlanStep(assessmentId, key, nextDone);
      if (r.ok) {
        setDoneSet((s) => {
          const n = new Set(s);
          if (nextDone) n.add(key);
          else n.delete(key);
          return n;
        });
        track("plan_step", { key, done: nextDone });
      } else {
        setError("Could not save that — please try again.");
      }
    });
  }

  const total = weeks.reduce((n, w) => n + w.items.length, 0);
  const completed = weeks.reduce((n, w) => n + w.items.filter((i) => optimistic.has(i.key)).length, 0);

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="text-sm text-ink-2">
          {completed} of {total} done
        </div>
        <div className="h-1.5 flex-1 max-w-[200px] rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full bg-clear transition-[width] duration-300"
            style={{ width: `${total ? (completed / total) * 100 : 0}%` }}
          />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {weeks.map((w) => (
          <div key={w.week} className="slab-inset p-4">
            <div className="eyebrow mb-3">Week {w.week}</div>
            <ul className="space-y-2.5">
              {w.items.map((it) => {
                const checked = optimistic.has(it.key);
                return (
                  <li key={it.key}>
                    <button
                      type="button"
                      onClick={() => toggle(it.key)}
                      disabled={!canCheck}
                      aria-pressed={checked}
                      className={`flex items-start gap-3 text-left w-full rounded-xl p-1.5 -m-1.5 transition-colors ${
                        canCheck ? "hover:bg-white/[0.04]" : "cursor-default"
                      }`}
                    >
                      <span
                        className={`mt-0.5 grid place-items-center w-5 h-5 shrink-0 rounded-md border transition-colors ${
                          checked ? "bg-clear border-clear text-void" : "border-line-2"
                        }`}
                        aria-hidden="true"
                      >
                        {checked && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2.5 6.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className={`block text-sm leading-snug ${checked ? "text-ink-3 line-through" : "text-ink"}`}>
                          {it.text}
                        </span>
                        <span className="block text-[11px] text-ink-3 mt-0.5">{it.source}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm text-alert">
          {error}
        </p>
      )}
      {!canCheck && (
        <p className="mt-3 text-xs text-ink-3">Check-offs are saved for the account that owns this report.</p>
      )}
    </div>
  );
}
