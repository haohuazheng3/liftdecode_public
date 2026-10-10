/**
 * The waiting screen's stages. The writer streams JSON in schema order, so the last top-level
 * key that has appeared says how far it has got. Shared by the server (which stores the stage)
 * and the client (which shows the labels). Stage 0 is the model reading and thinking before it
 * writes anything.
 */
export const STAGES: { key: string | null; label: string }[] = [
  { key: null, label: "Reading every answer together" },
  { key: "headline", label: "Tracing the chain behind your stall" },
  { key: "problems", label: "Working through each problem in your case" },
  { key: "scorecard", label: "Scoring every part of your set-up" },
  { key: "doseAudit", label: "Auditing your training dose" },
  { key: "fuelAudit", label: "Auditing fuel, sweat and minerals" },
  { key: "recovery", label: "Checking recovery and conditioning" },
  { key: "plan", label: "Writing your four-week plan" },
];

/** roughly how long a finished report's JSON is, for the progress estimate */
export const EXPECTED_CHARS = 22000;

export function stageFromText(text: string): number {
  let stage = 0;
  for (let i = 1; i < STAGES.length; i++) {
    if (text.includes(`"${STAGES[i].key}"`)) stage = i;
  }
  return stage;
}

/** the share of the bar that belongs to reading and thinking, before anything is written */
const THINKING_SHARE = 30;

/**
 * 0–100 for the progress bar. Reading and thinking (nothing written yet) eases towards 30% on time
 * alone and keeps moving the whole while: the first real run thought for about 100 seconds, and a
 * bar parked at 12% for that long reads as frozen. Writing then runs from 30% with the written
 * characters, never quite reaching 100 until the report is saved.
 */
export function progressFrom(chars: number, thinkingSeconds: number): number {
  if (chars === 0) return Math.round(2 + (THINKING_SHARE - 2) * (1 - Math.exp(-thinkingSeconds / 70)));
  return Math.min(97, Math.round(THINKING_SHARE + (97 - THINKING_SHARE) * Math.min(1, chars / EXPECTED_CHARS)));
}
