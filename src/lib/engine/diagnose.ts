import type { Condition, FindingRule, Question, Track } from "@/content/types";
import type { Answers } from "@/lib/db/schema";
import type { ClearanceResult, DiagnosisResult, FindingResult } from "./types";

export const ENGINE_VERSION = "1.0.0";

type QuestionIndex = Map<string, Question>;

function indexQuestions(questions: Question[]): QuestionIndex {
  const m = new Map<string, Question>();
  for (const q of questions) m.set(q.id, q);
  return m;
}

/** Questions a given track sees, in display order. */
export function questionsForTrack(questions: Question[], track: Track): Question[] {
  return questions.filter((q) => q.audience === "both" || q.audience === track);
}

function selected(answers: Answers, qid: string): string[] {
  const v = answers[qid];
  if (v === undefined || v === null) return [];
  return Array.isArray(v) ? v : [v];
}

export function evalCondition(c: Condition, answers: Answers, track: Track): boolean {
  if ("track" in c) return c.track === track;
  if ("all" in c) return c.all.every((x) => evalCondition(x, answers, track));
  if ("any" in c) return c.any.some((x) => evalCondition(x, answers, track));
  const values = selected(answers, c.q);
  if ("in" in c) return values.some((v) => c.in.includes(v));
  if ("notIn" in c) return values.length > 0 && !values.some((v) => c.notIn.includes(v));
  return false;
}

/** Replace {answer:question_id} with the label(s) the user chose. */
export function renderBecause(template: string, answers: Answers, qi: QuestionIndex): string {
  return template.replace(/\{answer:([a-z0-9_]+)\}/gi, (_, qid: string) => {
    const q = qi.get(qid);
    const values = selected(answers, qid);
    if (!q || values.length === 0) return "your answer";
    const labels = values
      .map((v) => q.options.find((o) => o.value === v)?.label)
      .filter((x): x is string => Boolean(x));
    if (labels.length === 0) return "your answer";
    if (labels.length === 1) return `“${labels[0]}”`;
    return labels.map((l) => `“${l}”`).join(", ");
  });
}

export interface EngineInput {
  track: Track;
  answers: Answers;
  questions: Question[];
  rules: FindingRule[];
  clearances: { id: string; audience: "both" | Track; when: Condition; title: string; text: string }[];
}

export function diagnose(input: EngineInput): DiagnosisResult {
  const { track, answers, questions, rules, clearances } = input;
  const qi = indexQuestions(questions);
  const visible = questionsForTrack(questions, track);

  const scored: FindingResult[] = [];
  for (const rule of rules) {
    if (rule.audience !== "both" && rule.audience !== track) continue;
    let score = 0;
    let max = 0;
    const fired: FindingResult["triggers"] = [];
    for (const t of rule.triggers) {
      max += t.weight;
      if (evalCondition(t.when, answers, track)) {
        score += t.weight;
        fired.push({ because: renderBecause(t.because, answers, qi), weight: t.weight });
      }
    }
    if (score >= rule.threshold && fired.length > 0) {
      scored.push({
        id: rule.id,
        category: rule.category,
        score,
        confidence: max > 0 ? Math.min(1, score / max) : 0,
        triggers: fired.sort((a, b) => b.weight - a.weight),
      });
    }
  }

  // Suppression: hide a finding when any of its suppressors is present with a higher score.
  const byId = new Map(scored.map((f) => [f.id, f]));
  const ruleById = new Map(rules.map((r) => [r.id, r]));
  const suppressed: string[] = [];
  const kept = scored.filter((f) => {
    const sup = ruleById.get(f.id)?.suppressedBy ?? [];
    const hidden = sup.some((sid) => {
      const other = byId.get(sid);
      return other !== undefined && other.score > f.score;
    });
    if (hidden) suppressed.push(f.id);
    return !hidden;
  });

  kept.sort((a, b) => b.score - a.score || b.confidence - a.confidence || a.id.localeCompare(b.id));

  const clear: ClearanceResult[] = [];
  for (const c of clearances) {
    if (c.audience !== "both" && c.audience !== track) continue;
    if (evalCondition(c.when, answers, track)) clear.push({ id: c.id, title: c.title, text: c.text });
  }

  const answeredCount = visible.filter((q) => selected(answers, q.id).length > 0).length;

  return {
    version: ENGINE_VERSION,
    track,
    findings: kept,
    primary: kept[0]?.id ?? null,
    clearances: clear,
    answeredCount,
    questionCount: visible.length,
    suppressed,
  };
}
