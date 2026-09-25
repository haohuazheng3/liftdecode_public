"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { METRICS, unitsFor, type Entry, type MetricSeries } from "@/lib/tracker";
import { addTrackerEntry, removeTrackerEntry } from "./actions";
import { track } from "@/components/Analytics";

function today() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function Sparkline({ entries }: { entries: Entry[] }) {
  if (entries.length < 2) return <div className="h-10" />;
  const w = 240;
  const h = 40;
  const vals = entries.map((e) => e.value);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  const pts = entries.map((e, i) => {
    const x = (i / (entries.length - 1)) * (w - 8) + 4;
    const y = h - 4 - ((e.value - min) / range) * (h - 8);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-10" aria-hidden="true" preserveAspectRatio="none">
      <polyline points={pts.join(" ")} fill="none" stroke="#f5b544" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {pts.slice(-1).map((p) => {
        const [x, y] = p.split(",").map(Number);
        return <circle key={p} cx={x} cy={y} r="3" fill="#f5b544" />;
      })}
    </svg>
  );
}

export function TrackerClient({ series }: { series: MetricSeries[] }) {
  const router = useRouter();
  const [metric, setMetric] = useState<string>(METRICS[0].key);
  const info = METRICS.find((m) => m.key === metric)!;
  const units = unitsFor(info.kind);
  const [unit, setUnit] = useState(units[0]);
  const [value, setValue] = useState("");
  const [loggedOn, setLoggedOn] = useState(today());
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [confirming, setConfirming] = useState<number | null>(null);
  const [removed, setRemoved] = useState<Set<number>>(() => new Set());
  const confirmTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (confirmTimer.current) window.clearTimeout(confirmTimer.current);
    };
  }, []);

  function onMetric(k: string) {
    setMetric(k);
    const m = METRICS.find((x) => x.key === k)!;
    setUnit(unitsFor(m.kind)[0]);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const v = Number(value);
    if (!Number.isFinite(v) || v <= 0) {
      setMsg({ kind: "err", text: "Enter a number greater than zero." });
      return;
    }
    setMsg({ kind: "ok", text: "Saving…" });
    startTransition(async () => {
      const r = await addTrackerEntry({ metric, loggedOn, value: v, unit, note: note || undefined });
      if (r.ok) {
        setMsg({ kind: "ok", text: "Logged." });
        setValue("");
        setNote("");
        track("tracker_log", { metric });
        router.refresh();
      } else {
        setMsg({ kind: "err", text: r.error ?? "Could not save." });
      }
    });
  }

  // Deleting is two taps: the first turns the button into "Confirm?" for three seconds.
  function askRemove(id: number) {
    setConfirming(id);
    if (confirmTimer.current) window.clearTimeout(confirmTimer.current);
    confirmTimer.current = window.setTimeout(() => setConfirming((c) => (c === id ? null : c)), 3000);
  }

  function remove(id: number) {
    if (confirmTimer.current) window.clearTimeout(confirmTimer.current);
    setConfirming(null);
    setRemoved((s) => new Set(s).add(id)); // the row goes now; the server list catches up on refresh
    setMsg(null);
    startTransition(async () => {
      const r = await removeTrackerEntry(id);
      if (r.ok) {
        router.refresh();
      } else {
        setRemoved((s) => {
          const n = new Set(s);
          n.delete(id);
          return n;
        });
        setMsg({ kind: "err", text: "Could not delete that entry — it is still here." });
      }
    });
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr] lg:items-start">
      <form onSubmit={submit} className="slab p-5 sm:p-6 lg:sticky lg:top-24">
        <div className="eyebrow mb-3">Log a number</div>
        <label className="block text-sm text-ink-2 mb-1" htmlFor="metric">
          Metric
        </label>
        <select id="metric" className="input mb-3" value={metric} onChange={(e) => onMetric(e.target.value)}>
          {METRICS.map((m) => (
            <option key={m.key} value={m.key}>
              {m.label}
            </option>
          ))}
        </select>
        <div className="grid grid-cols-[1fr_auto] gap-2 mb-3">
          <div>
            <label className="block text-sm text-ink-2 mb-1" htmlFor="value">
              Value
            </label>
            <input
              id="value"
              className="input"
              inputMode="decimal"
              placeholder={info.kind === "lift" ? "e.g. 100" : info.kind === "body" ? "e.g. 82.4" : "e.g. 38.5"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-ink-2 mb-1" htmlFor="unit">
              Unit
            </label>
            <select id="unit" className="input" value={unit} onChange={(e) => setUnit(e.target.value)}>
              {units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>
        <label className="block text-sm text-ink-2 mb-1" htmlFor="date">
          Date
        </label>
        <input id="date" type="date" className="input mb-3" value={loggedOn} max={today()} onChange={(e) => setLoggedOn(e.target.value)} />
        <label className="block text-sm text-ink-2 mb-1" htmlFor="note">
          Note <span className="text-ink-3">(optional)</span>
        </label>
        <input id="note" className="input mb-4" placeholder="e.g. 3 reps, felt heavy" value={note} maxLength={200} onChange={(e) => setNote(e.target.value)} />
        <button type="submit" className="btn btn-primary w-full" disabled={pending} aria-busy={pending}>
          {pending ? "Saving…" : "Log it"}
        </button>
        {msg && (
          <p role="status" className={`mt-3 text-sm ${msg.kind === "err" ? "text-alert" : "text-ink-3"}`}>
            {msg.text}
          </p>
        )}
        <p className="mt-3 text-xs text-ink-3 leading-relaxed">
          One number per metric per day; logging the same day again overwrites. Log lifts as the heaviest set of the
          session at the same rep count each week.
        </p>
      </form>

      <div className="space-y-3">
        {series.length === 0 && (
          <div className="slab p-6">
            <div className="eyebrow mb-2">Nothing logged yet</div>
            <p className="text-ink-2 leading-relaxed">
              Log your main lifts and one body measurement each week. After three weeks the tracker starts flagging
              anything that has stopped moving — which is exactly what to re-diagnose.
            </p>
          </div>
        )}
        {series.map((s) => (
          <div key={s.key} className="slab p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold">{s.label}</div>
                <div className="text-xs text-ink-3 mt-0.5">
                  {s.entries.length} entr{s.entries.length === 1 ? "y" : "ies"} over {s.spanDays} day{s.spanDays === 1 ? "" : "s"}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-lg">
                  {s.entries[s.entries.length - 1].value} <span className="text-xs text-ink-3">{s.unit}</span>
                </div>
                {s.delta28 !== null && (
                  <div className={`text-xs ${s.delta28 > 0 ? "text-clear" : s.delta28 < 0 ? "text-alert" : "text-ink-3"}`}>
                    {s.delta28 > 0 ? "+" : ""}
                    {s.delta28} {s.unit} · 28d
                  </div>
                )}
              </div>
            </div>
            <div className="mt-3">
              <Sparkline entries={s.entries} />
            </div>
            {s.stalled && (
              <div className="mt-2 tag tag-alert">Stalled 3+ weeks — re-diagnose</div>
            )}
            <details className="mt-3">
              <summary className="text-xs text-ink-3 cursor-pointer select-none">History</summary>
              <ul className="mt-2 space-y-1.5">
                {[...s.entries]
                  .reverse()
                  .filter((e) => !removed.has(e.id))
                  .map((e) => {
                    const confirm = confirming === e.id;
                    return (
                      <li key={e.id} className="flex items-center justify-between gap-2 text-sm">
                        <span className="font-mono text-ink-3">{e.loggedOn}</span>
                        <span className="flex-1 min-w-0 text-ink">
                          {e.value} {e.unit}
                          {e.note && <span className="text-ink-3"> — {e.note}</span>}
                        </span>
                        <button
                          type="button"
                          className={`btn btn-sm !px-3 shrink-0 ${confirm ? "btn-ghost !text-alert" : "btn-quiet"}`}
                          onClick={() => (confirm ? remove(e.id) : askRemove(e.id))}
                          aria-label={confirm ? `Confirm delete entry ${e.loggedOn}` : `Delete entry ${e.loggedOn}`}
                        >
                          {confirm ? "Confirm?" : "Delete"}
                        </button>
                      </li>
                    );
                  })}
              </ul>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}
