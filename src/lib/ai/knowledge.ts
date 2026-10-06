import { CONTESTED, EVIDENCE, EVIDENCE_RULES } from "./evidence";

/**
 * The knowledge base as the model reads it: how to use the evidence, every entry (id, confidence,
 * claim, how to apply it), and the claims that must not be stated as fact. Sources stay out of
 * the prompt; the report links each cited id to its source itself.
 */
export const KNOWLEDGE = [
  "## Rules for using the evidence",
  ...EVIDENCE_RULES,
  "",
  "## Entries",
  ...EVIDENCE.map((e) => `[${e.id}] (${e.confidence.split(" ")[0]}) ${e.claim}\n  Apply: ${e.use}`),
  "",
  "## Contested: never state these as fact (say the evidence is mixed or missing if they come up)",
  ...CONTESTED.map((c) => `- ${c}`),
].join("\n");

const BY_ID = new Map(EVIDENCE.map((e) => [e.id, e]));
export const evidenceById = (id: string) => BY_ID.get(id);
