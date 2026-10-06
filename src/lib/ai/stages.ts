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

/**
 * 0–100 for the progress bar: the first 12% belongs to reading and thinking (time-based, since
 * nothing is written yet), the rest follows the written characters, never quite reaching 100
 * until the report is saved.
 */
export function progressFrom(chars: number, thinkingSeconds: number): number {
  if (chars === 0) return Math.min(12, Math.round(2 + thinkingSeconds / 6));
  return Math.min(97, Math.round(12 + 85 * Math.min(1, chars / EXPECTED_CHARS)));
}
