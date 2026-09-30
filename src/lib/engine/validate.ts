import type { Question } from "@/content/types";

/**
 * One raw value checked against one question; returns the stored form or undefined.
 * Kept free of rule imports so the quiz (client) can use it without pulling the rule set.
 */
export function validateAnswer(q: Question, v: unknown): string | string[] | undefined {
  if (q.type === "scale") {
    const min = q.scale?.min ?? 1;
    const max = q.scale?.max ?? 10;
    const n = typeof v === "string" || typeof v === "number" ? Number(v) : NaN;
    return Number.isInteger(n) && n >= min && n <= max ? String(n) : undefined;
  }
  if (q.type === "number") {
    const spec = q.number;
    const n = typeof v === "string" || typeof v === "number" ? Number(v) : NaN;
    if (!spec || !Number.isFinite(n) || n < spec.min || n > spec.max) return undefined;
    // stored to the question's precision (0.5 kg, whole cm)
    const rounded = Math.round(n / spec.step) * spec.step;
    return Number.isInteger(rounded) ? String(rounded) : String(Number(rounded.toFixed(2)));
  }
  const valid = new Set(q.options.map((o) => o.value));
  if (q.type === "multi") {
    const arr = Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && valid.has(x)) : [];
    if (arr.length === 0) return undefined;
    const exclusive = arr.find((x) => q.options.find((o) => o.value === x)?.exclusive);
    const picked = exclusive ? [exclusive] : Array.from(new Set(arr));
    return q.maxSelect ? picked.slice(0, q.maxSelect) : picked;
  }
  return typeof v === "string" && valid.has(v) ? v : undefined;
}
