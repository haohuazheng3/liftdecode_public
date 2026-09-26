import type { Track } from "@/content/types";
import { QUESTIONS, SECTIONS } from "@/content/questions";
import { FINDING_RULES, CLEARANCES } from "@/content/rules";
import type { Answers } from "@/lib/db/schema";
import { diagnose, questionsForTrack } from "./diagnose";
import type { DiagnosisResult } from "./types";

export { ENGINE_VERSION } from "./diagnose";
export type { DiagnosisResult, FindingResult } from "./types";

export function runDiagnosis(track: Track, answers: Answers): DiagnosisResult {
  return diagnose({ track, answers, questions: QUESTIONS, rules: FINDING_RULES, clearances: CLEARANCES });
}

export function visibleQuestions(track: Track) {
  return questionsForTrack(QUESTIONS, track);
}

export function isTrack(v: unknown): v is Track {
  return v === "physique" || v === "strength";
}

/** Validate a raw answers object against the question bank for a track. */
export function sanitizeAnswers(track: Track, raw: unknown): { answers: Answers; missing: string[] } {
  const answers: Answers = {};
  const missing: string[] = [];
  const obj = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  for (const q of questionsForTrack(QUESTIONS, track)) {
    const v = obj[q.id];
    if (q.type === "scale") {
      const min = q.scale?.min ?? 1;
      const max = q.scale?.max ?? 10;
      const n = typeof v === "string" || typeof v === "number" ? Number(v) : NaN;
      if (Number.isInteger(n) && n >= min && n <= max) answers[q.id] = String(n);
      else missing.push(q.id);
      continue;
    }
    const valid = new Set(q.options.map((o) => o.value));
    if (q.type === "single") {
      if (typeof v === "string" && valid.has(v)) answers[q.id] = v;
      else missing.push(q.id);
    } else {
      const arr = Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && valid.has(x)) : [];
      if (arr.length > 0) answers[q.id] = q.maxSelect ? arr.slice(0, q.maxSelect) : arr;
      else missing.push(q.id);
    }
  }
  return { answers, missing };
}

export { SECTIONS, QUESTIONS };
