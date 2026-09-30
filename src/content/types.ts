/**
 * LiftDecode content model (v3, 2026-09-30).
 *
 * Everything the diagnostic engine consumes is declared with these types:
 *   - questions.ts   → the question bank (shared intake + per-track questions) and screens
 *   - derived.ts     → answers computed from other answers (BMI band, weekly hours, g/kg …)
 *   - rules.ts       → finding rules (answer patterns → findings) and clearances
 *   - findings/*.ts  → the long-form report content for each finding
 *
 * Content files must be pure data (no runtime imports besides these types).
 */

export type Track = "physique" | "strength";
export type Audience = Track | "both";

/**
 * Question formats (v3). Answering should still feel quick, but the intake now takes real
 * numbers where the report needs them (the owner's 2026-09-30 decision):
 *   - "scale"  — a 1–10 intensity tap with two short anchors
 *   - "single" — 2–7 short options, one tap
 *   - "pills"  — one row of very short options (counts, bands), one tap
 *   - "number" — a typed number with an optional unit toggle (height, weight, age)
 *   - "image"  — one of a few photo cards (body type), photos can differ by sex
 *   - "multi"  — pick any of a short list of signs, with an exclusive "none" option
 */
export type QuestionType = "single" | "scale" | "pills" | "number" | "image" | "multi";

export interface AnswerOption {
  /** stable snake_case id, unique within the question */
  value: string;
  /** shown to the user: a few words, no explanation */
  label: string;
  /** image questions: a one-line description under the photo */
  caption?: string;
  /** image questions: photo per sex answer ("male" | "female"); any other sex shows both */
  images?: Record<string, string>;
  /** multi questions: selecting this clears the others (e.g. "None of these") */
  exclusive?: boolean;
}

/** 1–10 intensity scale. Answers are stored as the strings "1" … "10". */
export interface ScaleSpec {
  min: 1;
  max: 10;
  /** anchor under 1, e.g. "Never" (1–3 words) */
  low: string;
  /** anchor under 10, e.g. "Every set" (1–3 words) */
  high: string;
}

/** One selectable unit for a number question; `toBase` converts a typed value to the stored unit. */
export interface UnitSpec {
  key: string;
  label: string;
  /** typed value in this unit → stored (base) value */
  toBase: (v: number) => number;
  /** stored (base) value → shown value in this unit */
  fromBase: (v: number) => number;
  /** decimals to show when displaying in this unit */
  decimals?: number;
  /** ft/in style: a second field for the remainder */
  compound?: { label: string; perUnit: number; secondLabel: string };
}

/** A typed number. Answers are stored as the string of the base-unit value (e.g. "178" cm, "82" kg). */
export interface NumberSpec {
  min: number;
  max: number;
  step: number;
  /** first unit is the base (stored) unit */
  units: UnitSpec[];
  placeholder?: string;
}

export interface Question {
  /** snake_case, globally unique, e.g. "sleep_quality" */
  id: string;
  /** which track sees it */
  audience: Audience;
  /** id of the group it belongs to (ordering only — never shown to the user) */
  section: string;
  /** questions sharing a screen id render together; see SCREENS for the screen's title */
  screen?: string;
  type: QuestionType;
  /** the question itself — short and plain; on a shared screen it is the field label */
  prompt: string;
  /** one or two plain sentences under the prompt when the owner asked for a definition */
  help?: string;
  /** single / pills / image / multi: the options; scale / number: empty */
  options: AnswerOption[];
  /** required when type === "scale" */
  scale?: ScaleSpec;
  /** required when type === "number" */
  number?: NumberSpec;
  /** multi: how many may be selected */
  maxSelect?: number;
}

/** Internal grouping for ordering the questions. Never rendered. */
export interface Section {
  id: string;
  title: string;
}

/** A screen that holds several questions (the "About you" and per-muscle screens). */
export interface Screen {
  id: string;
  /** the headline of the screen (the questions' prompts become field labels) */
  title: string;
  /** optional line under the headline */
  lead?: string;
}

/**
 * An answer computed from other answers (never shown to the user). Rules reference derived
 * ids exactly like question ids; the value is one of `options`, or undefined when the inputs
 * are missing. `from` lists the questions it reads — the gate counts them as used.
 */
export interface DerivedQuestion {
  id: string;
  audience: Audience;
  /** the label used when a because-line quotes {answer:id} */
  prompt: string;
  from: string[];
  options: AnswerOption[];
  compute: (answers: Record<string, string | string[] | undefined>) => string | undefined;
}

export type FindingCategory =
  | "measurement" // they may actually be progressing / measuring wrong
  | "progression" // no progressive overload / no tracking
  | "effort" // sets end too far from failure (or too close, too often)
  | "volume" // too little / too much
  | "programming" // exercise selection, structure, program hopping, specificity
  | "technique"
  | "recovery" // sleep, stress, fatigue, deloads
  | "nutrition" // calories, protein, energy balance direction
  | "consistency"
  | "expectations" // timeline & rate calibration
  | "lifestyle"; // cardio interference, steps, alcohol, etc.

/**
 * Conditions are evaluated against the user's answers (raw + derived).
 * For single / pills / image questions the answer is a string; for scale and number
 * questions it is a numeric string; multi answers are string[].
 * `in` matches when the answer (or any selected value) is in the list.
 * `notIn` matches when the question was answered and none of the values are in the list.
 * `range` matches a scale or number answer inside [low, high], both inclusive.
 */
export type Condition =
  | { q: string; in: string[] }
  | { q: string; notIn: string[] }
  | { q: string; range: [number, number] }
  | { all: Condition[] }
  | { any: Condition[] }
  | { track: Track };

export interface Trigger {
  when: Condition;
  /** 1–5: contribution to the finding score when `when` matches */
  weight: number;
  /**
   * Shown in the report under "What you told us".
   * Second person, one sentence, may quote the answer with {answer:question_id}
   * which renders as the label the user selected, "7/10" for a scale, "82 kg" for a number.
   */
  because: string;
}

export interface FindingRule {
  id: string;
  audience: Audience;
  category: FindingCategory;
  /** minimum summed weight for the finding to appear */
  threshold: number;
  triggers: Trigger[];
  /** if any of these findings is present with a higher score, hide this one */
  suppressedBy?: string[];
}

/** "This is NOT your problem" — reassurance that also proves the report read their answers */
export interface ClearanceRule {
  id: string;
  audience: Audience;
  when: Condition;
  title: string;
  /** 1–3 sentences, second person */
  text: string;
}

export interface FixBlock {
  title: string;
  /** concrete, numbered-ready steps; each 1–3 sentences */
  steps: string[];
}

export interface FindingContent {
  id: string;
  audience: Audience;
  category: FindingCategory;
  /** e.g. "Your sets end too early to grow" */
  title: string;
  /** one-sentence verdict, second person */
  verdict: string;
  /**
   * 2–3 sentences shown in the LOCKED preview. Must make the reader feel seen
   * and want the rest — name the problem, hint at the cost, do not give the fix.
   */
  summary: string;
  /** paragraphs: why this stalls progress — physiology and logic, evidence-informed */
  mechanism: string[];
  /** bullets: symptoms the reader will recognize in their own training */
  howItShowsUp: string[];
  /** the protocol */
  fix: FixBlock[];
  /** exactly 4 entries: week 1..4 directive for the action plan (each 1–2 sentences) */
  fourWeekPlan: [string, string, string, string];
  /** what to expect and when */
  timeline: string;
  /** common wrong fixes people reach for */
  mistakes: string[];
  /** when audience is "both": track-specific nuance */
  trackNotes?: { physique?: string; strength?: string };
  /** ids of findings that commonly co-occur */
  relatedFindings?: string[];
}

/**
 * Hand-written answer sets with the outcome a coach would expect. The rule
 * simulator (scripts/rules-sim.ts) fails if the engine disagrees.
 */
export interface Persona {
  name: string;
  track: Track;
  /** every question of the track except "goal"; scale answers as "1" … "10", numbers as strings */
  answers: Record<string, string | string[]>;
  expect: {
    min: number;
    max: number;
    mustInclude?: string[];
    mustExclude?: string[];
    /** the top-ranked finding should be one of these */
    primaryOneOf?: string[];
  };
}
