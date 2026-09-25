/**
 * LiftDecode content model.
 *
 * Everything the diagnostic engine consumes is declared with these types:
 *   - questions.ts   → the question bank (shared intake + per-track questions)
 *   - rules.ts       → finding rules (answer patterns → findings) and clearances
 *   - findings/*.ts  → the long-form report content for each finding
 *
 * Content files must be pure data (no runtime imports besides these types).
 */

export type Track = "physique" | "strength";
export type Audience = Track | "both";

export type QuestionType = "single" | "multi";

export interface AnswerOption {
  /** stable snake_case id, unique within the question */
  value: string;
  /** shown to the user: a concrete, self-recognizable behaviour or state */
  label: string;
  /** optional one-line clarifier under the label */
  detail?: string;
}

export interface Question {
  /** snake_case, globally unique, e.g. "progress_measure" */
  id: string;
  /** which track sees it */
  audience: Audience;
  /** id of the section (chapter) it belongs to — see SECTIONS */
  section: string;
  type: QuestionType;
  /** the question itself */
  prompt: string;
  /** "Why we ask" microcopy shown under the prompt (1–2 sentences) */
  help?: string;
  /** 3–7 options */
  options: AnswerOption[];
  /** for multi: max number of selections (default unlimited) */
  maxSelect?: number;
}

export interface Section {
  id: string;
  /** chapter title shown to the user */
  title: string;
  /** one line under the title explaining what this chapter uncovers */
  intro: string;
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
 * Conditions are evaluated against the user's answers.
 * For single-choice questions the answer is a string; for multi it is a string[].
 * `in` matches when the answer (or any selected value) is in the list.
 * `notIn` matches when the question was answered and none of the values are in the list.
 */
export type Condition =
  | { q: string; in: string[] }
  | { q: string; notIn: string[] }
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
   * which renders as the label the user selected.
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
