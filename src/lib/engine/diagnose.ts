import type { Condition, FindingRule, Question, Screen, Track } from "@/content/types";
import { computeDerived, DERIVED } from "@/content/derived";
import type { Answers } from "@/lib/db/schema";
import type { ClearanceResult, DiagnosisResult, FindingResult } from "./types";

export const ENGINE_VERSION = "4.0.0";

/** what a because-line can quote: a real question or a derived answer */
type Quotable = { type: Question["type"] | "derived"; prompt: string; options: { value: string; label: string }[]; scaleMax?: number; unit?: string };
type QuoteIndex = Map<string, Quotable>;

function indexQuotables(questions: Question[]): QuoteIndex {
  const m = new Map<string, Quotable>();
  for (const q of questions) {
    m.set(q.id, {
      type: q.type,
      prompt: q.prompt,
      options: q.options,
      scaleMax: q.scale?.max,
      unit: q.number?.units[0]?.label,
    });
  }
  for (const d of DERIVED) m.set(d.id, { type: "derived", prompt: d.prompt, options: d.options });
  return m;
}

/** Questions a given track sees, in display order. */
export function questionsForTrack(questions: Question[], track: Track): Question[] {
  return questions.filter((q) => q.audience === "both" || q.audience === track);
}

export interface QuizScreen {
  /** the screen id (a shared screen's id, or the single question's id) */
  id: string;
  screen?: Screen;
  questions: Question[];
}

/** Screens a track sees: consecutive questions sharing a `screen` id render together. */
export function screensForTrack(questions: Question[], screens: Screen[], track: Track): QuizScreen[] {
  const out: QuizScreen[] = [];
  for (const q of questionsForTrack(questions, track)) {
    const last = out[out.length - 1];
    if (q.screen && last && last.screen?.id === q.screen) {
      last.questions.push(q);
      continue;
    }
    const screen = q.screen ? screens.find((s) => s.id === q.screen) : undefined;
    out.push({ id: screen?.id ?? q.id, screen, questions: [q] });
  }
  return out;
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
  if ("range" in c) {
    const n = Number(values[0]);
    return values.length === 1 && Number.isFinite(n) && n >= c.range[0] && n <= c.range[1];
  }
  if ("in" in c) return values.some((v) => c.in.includes(v));
  if ("notIn" in c) return values.length > 0 && !values.some((v) => c.notIn.includes(v));
  return false;
}

/** Replace {answer:question_id} with the label(s) the user chose, "7/10", or "82 kg". */
export function renderBecause(template: string, answers: Answers, qi: QuoteIndex): string {
  return template.replace(/\{answer:([a-z0-9_]+)\}/gi, (_, qid: string) => {
    const q = qi.get(qid);
    const values = selected(answers, qid);
    if (!q || values.length === 0) return "your answer";
    if (q.type === "scale") return `${values[0]}/${q.scaleMax ?? 10}`;
    if (q.type === "number") {
      const n = Number(values[0]);
      const shown = Number.isInteger(n) ? String(n) : n.toFixed(1);
      return q.unit && q.unit !== "years" ? `${shown} ${q.unit}` : shown;
    }
    const labels = values
      .map((v) => q.options.find((o) => o.value === v)?.label)
      .filter((x): x is string => Boolean(x));
    if (labels.length === 0) return "your answer";
    // numeric-looking labels ("3", "7–8", "<100", "4+") read as numbers, words get quotes
    const show = (l: string) => (/^[\d<>+–\-.,% ]+$/.test(l) ? l : `“${l}”`);
    if (labels.length === 1) return show(labels[0]);
    return labels.map(show).join(", ");
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
  const { track, questions, rules, clearances } = input;
  const qi = indexQuotables(questions);
  const visible = questionsForTrack(questions, track);
  // derived bands (BMI, weekly hours, g/kg …) sit beside the raw answers for the rules
  const answers: Answers = { ...input.answers, ...computeDerived(input.answers) };

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
      if (other === undefined) return false;
      if (other.score > f.score) return true;
      // Mutually exclusive pair on an exact tie: keep exactly one, deterministically.
      const mutual = (ruleById.get(sid)?.suppressedBy ?? []).includes(f.id);
      return mutual && other.score === f.score && other.id < f.id;
    });
    if (hidden) suppressed.push(f.id);
    return !hidden;
  });

  // "Slow is normal" (the expectations finding) never takes the headline from an actionable
  // problem: the report names what to fix first and keeps the reassurance for last.
  const lastResort = (f: FindingResult) => (f.category === "expectations" ? 1 : 0);
  kept.sort(
    (a, b) => lastResort(a) - lastResort(b) || b.score - a.score || b.confidence - a.confidence || a.id.localeCompare(b.id),
  );

  const clear: ClearanceResult[] = [];
  for (const c of clearances) {
    if (c.audience !== "both" && c.audience !== track) continue;
    if (evalCondition(c.when, answers, track)) clear.push({ id: c.id, title: c.title, text: c.text });
  }

  const answeredCount = visible.filter((q) => selected(input.answers, q.id).length > 0).length;

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
