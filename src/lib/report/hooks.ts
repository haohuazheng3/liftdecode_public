import { FINDINGS } from "@/content/findings";
import type { DiagnosisResult } from "@/lib/engine/types";
import { DIMENSION_META, FINDING_DIMENSION, weakestItems, type Dimension, type DimensionId } from "./scorecard";

/**
 * The paywall's hooks: the lifter's own problems, named, with the answers that point at them,
 * and nothing of the analysis itself. Findings come first, strongest first; when the engine found
 * fewer than three actionable ones, the weakest scorecard dimensions fill the gap, so even a
 * well-run lifter sees where their set-up leaks. "Slow is normal" is reassurance, never a hook.
 */
export interface Hook {
  kind: "finding" | "dimension";
  id: string;
  dimension: DimensionId | null;
  title: string;
  /** their own answers read back (never the reasoning) */
  evidence: string[];
  /** how many more of their answers point the same way */
  moreEvidence: number;
}

/** a because-line that quotes an answer (a “label”, an N/10, or a number) is the strongest proof */
const QUOTES_AN_ANSWER = /“|\b\d{1,2}\/10\b|\d/;

const WEAK_TITLE: Record<DimensionId, string> = {
  dose: "Your weekly dose is leaving growth on the table",
  effort: "Your sets may stop short of what builds muscle",
  progression: "Nothing is forcing your numbers up",
  execution: "How you perform your reps is costing you",
  fuel: "Your fuel isn't matching your goal",
  minerals: "Your sweat and minerals are out of balance",
  sleep: "Your recovery hours are working against you",
  conditioning: "Your conditioning is capping your work",
  life: "Life outside the gym is taxing your recovery",
  consistency: "Your training loop keeps breaking",
};

export function buildHooks(result: DiagnosisResult, dims: Dimension[], { min = 3, max = 5 } = {}): Hook[] {
  const hooks: Hook[] = [];
  const covered = new Set<DimensionId>();

  for (const f of result.findings) {
    if (hooks.length >= max) break;
    const content = FINDINGS[f.id];
    const dim = FINDING_DIMENSION[f.id] ?? null;
    if (!content || dim === null) continue;
    const quoting = f.triggers.filter((t) => QUOTES_AN_ANSWER.test(t.because));
    const evidence = (quoting.length ? quoting : f.triggers).slice(0, 2).map((t) => t.because);
    hooks.push({
      kind: "finding",
      id: f.id,
      dimension: dim,
      title: content.title,
      evidence,
      moreEvidence: Math.max(0, f.triggers.length - evidence.length),
    });
    covered.add(dim);
  }

  if (hooks.length < min) {
    const weakest = [...dims].sort((a, b) => a.score - b.score);
    for (const d of weakest) {
      if (hooks.length >= min) break;
      if (covered.has(d.id)) continue;
      const items = weakestItems(d, 2);
      const evidence = (items.length ? items : [...d.items].sort((x, y) => x.value - y.value).slice(0, 2)).map((i) => i.fact);
      hooks.push({
        kind: "dimension",
        id: d.id,
        dimension: d.id,
        title: d.score < 70 ? WEAK_TITLE[d.id] : `${DIMENSION_META[d.id].label} is your next lever, at ${d.score}/100`,
        evidence,
        moreEvidence: 0,
      });
      covered.add(d.id);
    }
  }
  return hooks;
}

/** findings that name an actionable problem (everything but the "slow is normal" verdict) */
export function actionableCount(result: DiagnosisResult): number {
  return result.findings.filter((f) => FINDINGS[f.id] && FINDING_DIMENSION[f.id] !== null).length;
}
