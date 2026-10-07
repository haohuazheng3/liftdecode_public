import type { ReactElement } from "react";
import { BENCH_PLATEAU, NOT_GAINING_MUSCLE, NOT_GAINING_WEIGHT, OVERTRAINING, SORENESS } from "@/content/minichecks";
import { MiniCheck } from "./MiniCheck";
import { GainRateCheck, ProteinCheck, ProteinPerMeal, SurplusCheck } from "./QuickChecks";
import { StandardsChecker, StrengthProfile, TotalChecker } from "./StandardsChecker";

/**
 * First-screen tools for A-level articles, by the `tool` id in their frontmatter. Calculator pages
 * under /tools use TOOL_COMPONENTS (./index.ts) instead. `scripts/seo-v3-check.ts` fails the build
 * check when an article names an id that is not here.
 */
export const PAGE_TOOLS: Record<string, () => ReactElement> = {
  "mini:not-gaining-muscle": () => <MiniCheck config={NOT_GAINING_MUSCLE} />,
  "mini:not-gaining-weight": () => <MiniCheck config={NOT_GAINING_WEIGHT} />,
  "mini:overtraining": () => <MiniCheck config={OVERTRAINING} />,
  "mini:bench-plateau": () => <MiniCheck config={BENCH_PLATEAU} />,
  "mini:soreness": () => <MiniCheck config={SORENESS} />,
  "check:protein": () => <ProteinCheck />,
  "check:surplus": () => <SurplusCheck />,
  "check:gain-rate": () => <GainRateCheck />,
  "check:protein-per-meal": () => <ProteinPerMeal />,
  "standards:bench-men": () => <StandardsChecker id="bench-men" eyebrow="Check your bench" lifts={["bench"]} />,
  "standards:bench": () => <StandardsChecker id="bench-standards" eyebrow="Check your bench" lifts={["bench"]} />,
  "standards:bench-225": () => <StandardsChecker id="bench-225" eyebrow="Your bench vs 225" lifts={["bench"]} milestoneLb={225} />,
  "standards:bench-315": () => <StandardsChecker id="bench-315" eyebrow="Your bench vs 315" lifts={["bench"]} milestoneLb={315} />,
  "standards:deadlift": () => <StandardsChecker id="deadlift" eyebrow="Check your deadlift" lifts={["deadlift"]} />,
  "standards:squat": () => <StandardsChecker id="squat" eyebrow="Check your squat" lifts={["squat"]} />,
  "standards:pullups": () => <StandardsChecker id="pullups" eyebrow="Check your pull-ups" lifts={["pullups"]} />,
  "standards:women": () => (
    <StandardsChecker id="women" eyebrow="Check your lifts" lifts={["bench", "squat", "deadlift"]} defaultSex="female" />
  ),
  "standards:dbbench": () => <StandardsChecker id="dbbench" eyebrow="Check your dumbbell press" lifts={["dbbench"]} />,
  "standards:legpress": () => <StandardsChecker id="legpress" eyebrow="Check your leg press" lifts={["legpress"]} />,
  "profile:average-man": () => <StrengthProfile id="average-man" eyebrow="Your lifts vs the average man" />,
  "total:1000": () => <TotalChecker id="1000-lb" eyebrow="Your total" />,
};

export function PageTool({ id }: { id: string }) {
  const render = PAGE_TOOLS[id];
  return render ? render() : null;
}
