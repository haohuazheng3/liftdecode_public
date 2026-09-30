import type { Track } from "@/content/types";
import { QUESTIONS, SCREENS, SECTIONS } from "@/content/questions";
import { FINDING_RULES, CLEARANCES } from "@/content/rules";
import type { Answers } from "@/lib/db/schema";
import { diagnose, questionsForTrack, screensForTrack } from "./diagnose";
import { validateAnswer } from "./validate";
import type { DiagnosisResult } from "./types";

export { ENGINE_VERSION } from "./diagnose";
export type { DiagnosisResult, FindingResult } from "./types";

export function runDiagnosis(track: Track, answers: Answers): DiagnosisResult {
  return diagnose({ track, answers, questions: QUESTIONS, rules: FINDING_RULES, clearances: CLEARANCES });
}

export function visibleQuestions(track: Track) {
  return questionsForTrack(QUESTIONS, track);
}

export function visibleScreens(track: Track) {
  return screensForTrack(QUESTIONS, SCREENS, track);
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
    const v = validateAnswer(q, obj[q.id]);
    if (v === undefined) missing.push(q.id);
    else answers[q.id] = v;
  }
  return { answers, missing };
}

export { SECTIONS, QUESTIONS, SCREENS, validateAnswer };
