import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { trackerEntries } from "@/lib/db/schema";

export const METRICS = [
  { key: "squat", label: "Squat (top set)", kind: "lift" },
  { key: "bench", label: "Bench press (top set)", kind: "lift" },
  { key: "deadlift", label: "Deadlift (top set)", kind: "lift" },
  { key: "press", label: "Overhead press (top set)", kind: "lift" },
  { key: "row", label: "Row (top set)", kind: "lift" },
  { key: "bodyweight", label: "Body weight", kind: "body" },
  { key: "waist", label: "Waist", kind: "measure" },
  { key: "chest", label: "Chest", kind: "measure" },
  { key: "arm", label: "Upper arm", kind: "measure" },
  { key: "thigh", label: "Thigh", kind: "measure" },
] as const;

export type MetricKey = (typeof METRICS)[number]["key"];
export type MetricKind = (typeof METRICS)[number]["kind"];

export function metricInfo(key: string) {
  return METRICS.find((m) => m.key === key) ?? null;
}

export function unitsFor(kind: MetricKind): string[] {
  return kind === "measure" ? ["cm", "in"] : ["kg", "lb"];
}

export interface Entry {
  id: number;
  loggedOn: string;
  value: number;
  unit: string;
  note: string | null;
}

export interface MetricSeries {
  key: MetricKey;
  label: string;
  kind: MetricKind;
  entries: Entry[];
  /** change from first to last entry within the last 28 days */
  delta28: number | null;
  unit: string | null;
  /** true when ≥3 entries spanning ≥21 days show no favourable change */
  stalled: boolean;
  spanDays: number;
}

export async function loadSeries(userId: string): Promise<MetricSeries[]> {
  const rows = await db
    .select({
      id: trackerEntries.id,
      metric: trackerEntries.metric,
      loggedOn: trackerEntries.loggedOn,
      value: trackerEntries.value,
      unit: trackerEntries.unit,
      note: trackerEntries.note,
    })
    .from(trackerEntries)
    .where(eq(trackerEntries.userId, userId))
    .orderBy(asc(trackerEntries.loggedOn));

  const byMetric = new Map<string, Entry[]>();
  for (const r of rows) {
    const list = byMetric.get(r.metric) ?? [];
    list.push({ id: r.id, loggedOn: String(r.loggedOn), value: Number(r.value), unit: r.unit, note: r.note });
    byMetric.set(r.metric, list);
  }

  const now = Date.now();
  const out: MetricSeries[] = [];
  for (const m of METRICS) {
    const entries = byMetric.get(m.key) ?? [];
    if (entries.length === 0) continue;
    const last = entries[entries.length - 1];
    const recent = entries.filter((e) => now - new Date(e.loggedOn).getTime() <= 28 * 86400000);
    const delta28 = recent.length >= 2 ? Number((recent[recent.length - 1].value - recent[0].value).toFixed(2)) : null;
    const spanDays = Math.round((new Date(last.loggedOn).getTime() - new Date(entries[0].loggedOn).getTime()) / 86400000);
    let stalled = false;
    if (entries.length >= 3) {
      const window = entries.slice(-6);
      const span = (new Date(window[window.length - 1].loggedOn).getTime() - new Date(window[0].loggedOn).getTime()) / 86400000;
      const best = Math.max(...window.slice(0, -1).map((e) => e.value));
      const worst = Math.min(...window.slice(0, -1).map((e) => e.value));
      const latest = window[window.length - 1].value;
      if (span >= 21) {
        if (m.kind === "lift") stalled = latest <= best;
        else if (m.kind === "measure" && m.key === "waist") stalled = latest >= worst && latest <= best;
        else stalled = Math.abs(latest - window[0].value) < Math.max(0.5, Math.abs(window[0].value) * 0.01);
      }
    }
    out.push({ key: m.key, label: m.label, kind: m.kind, entries, delta28, unit: last.unit, stalled, spanDays });
  }
  return out;
}

export async function deleteEntry(userId: string, id: number) {
  await db.delete(trackerEntries).where(and(eq(trackerEntries.userId, userId), eq(trackerEntries.id, id)));
}
