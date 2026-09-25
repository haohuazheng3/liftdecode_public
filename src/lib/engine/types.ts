import type { FindingCategory, Track } from "@/content/types";

export interface FiredTrigger {
  /** rendered "what you told us" sentence */
  because: string;
  weight: number;
}

export interface FindingResult {
  id: string;
  category: FindingCategory;
  score: number;
  /** score / max possible score for this finding, 0–1 */
  confidence: number;
  triggers: FiredTrigger[];
}

export interface ClearanceResult {
  id: string;
  title: string;
  text: string;
}

export interface DiagnosisResult {
  version: string;
  track: Track;
  /** sorted by score desc, after suppression */
  findings: FindingResult[];
  /** id of the top finding, if any */
  primary: string | null;
  clearances: ClearanceResult[];
  answeredCount: number;
  questionCount: number;
  /** finding ids that were hidden by suppression (for debugging / admin) */
  suppressed: string[];
}
