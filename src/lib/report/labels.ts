import type { FindingCategory } from "@/content/types";

export const CATEGORY_LABEL: Record<FindingCategory, string> = {
  measurement: "Measurement",
  progression: "Progression",
  effort: "Effort",
  volume: "Volume",
  programming: "Programming",
  technique: "Technique",
  recovery: "Recovery",
  nutrition: "Nutrition",
  consistency: "Consistency",
  expectations: "Expectations",
  lifestyle: "Lifestyle",
};

export const TRACK_LABEL = { physique: "Physique", strength: "Strength" } as const;
