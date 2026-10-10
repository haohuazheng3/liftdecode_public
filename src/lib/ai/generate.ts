import Anthropic from "@anthropic-ai/sdk";
import type { BetaMessage, BetaUsage } from "@anthropic-ai/sdk/resources/beta/messages/messages";
import { getAssessment } from "@/lib/assessments";
import { captureError, captureFromUnknown } from "@/lib/errors";
import { AiReportSchema, checkReport, normalizeReport, type AiReport } from "./schema";
import { buildUserMessage, SYSTEM_PROMPT } from "./prompt";
import { progressFrom, stageFromText, STAGES } from "./stages";
import { failJob, finishJob, setProgress } from "./jobs";

/**
 * Writes one paid analysis with Claude Opus 5.5. Only ever called for an assessment the caller has
 * just claimed (see claimJob), which only happens after payment.
 *
 * - Streaming, so the waiting screen can follow the writer through the report (progress is
 *   written to the job row every few seconds; the page polls it).
 * - JSON by instruction, validated here: the schema is in the system prompt, and the reply is
 *   parsed, repaired (normalizeReport) and checked against AiReportSchema. API-side structured
 *   outputs refused this schema as too large to compile, so the API does not enforce it.
 * - Effort is set explicitly (this model's default is medium; medium is what its long analytical
 *   writing was tuned at). Thinking is always on for this model and counts toward max_tokens.
 * - Server-side fallbacks ("default"): if a safety classifier declines the request, the API re-runs
 *   it on Anthropic's recommended fallback model inside the same call, instead of failing it.
 */
export const AI_MODEL = "claude-opus-5-5";
const EFFORT = "medium" as const;
const MAX_TOKENS = 40000;
const FALLBACK_BETA = "server-side-fallback-2026-07-01";

/** $ per million tokens; unknown fallback models are priced at the Claude Opus 5 rate */
const PRICES: Record<string, { input: number; output: number; cacheWrite: number; cacheRead: number }> = {
  "claude-opus-5-5": { input: 4, output: 20, cacheWrite: 5, cacheRead: 0.2 },
  "claude-opus-5": { input: 5, output: 25, cacheWrite: 6.25, cacheRead: 0.5 },
};
const priceOf = (model: string) => PRICES[model] ?? PRICES["claude-opus-5"];

function costMicros(usage: BetaUsage, servedBy: string): number {
  type Part = { model: string; input: number; output: number; cacheWrite: number; cacheRead: number };
  const parts: Part[] = [];
  for (const it of usage.iterations ?? []) {
    if ("model" in it && "input_tokens" in it && "output_tokens" in it) {
      parts.push({
        model: String(it.model),
        input: it.input_tokens,
        output: it.output_tokens,
        cacheWrite: it.cache_creation_input_tokens ?? 0,
        cacheRead: it.cache_read_input_tokens ?? 0,
      });
    }
  }
  if (!parts.length) {
    parts.push({
      model: servedBy,
      input: usage.input_tokens,
      output: usage.output_tokens,
      cacheWrite: usage.cache_creation_input_tokens ?? 0,
      cacheRead: usage.cache_read_input_tokens ?? 0,
    });
  }
  let dollars = 0;
  for (const p of parts) {
    const pr = priceOf(p.model);
    dollars += (p.input * pr.input + p.output * pr.output + p.cacheWrite * pr.cacheWrite + p.cacheRead * pr.cacheRead) / 1e6;
  }
  return Math.round(dollars * 1e6);
}

/** the final text: every text block in order (a mid-stream fallback continues in a new block) */
function finalText(m: BetaMessage): string {
  return m.content.map((b) => (b.type === "text" ? b.text : "")).join("");
}

/** the JSON object in the reply, without markdown fences or stray words around it */
export function extractJson(text: string): string {
  const unfenced = text.replace(/^\s*```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");
  const start = unfenced.indexOf("{");
  const end = unfenced.lastIndexOf("}");
  return start >= 0 && end > start ? unfenced.slice(start, end + 1) : unfenced;
}

export class AnalysisError extends Error {
  constructor(
    message: string,
    readonly kind: "config" | "refusal" | "truncated" | "invalid" | "api",
  ) {
    super(message);
    this.name = "AnalysisError";
  }
}

/**
 * Runs the analysis for a claimed job and stores the result (or the failure) on the job row.
 * Never throws: it is called from `after()`, where nobody is left to catch.
 */
export async function runAnalysis(assessmentId: string): Promise<void> {
  const started = Date.now();
  let usage: { model: string; inputTokens: number; outputTokens: number; costMicros: number } | undefined;
  let lastStage = 0;
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new AnalysisError("ANTHROPIC_API_KEY is not set", "config");
    const a = await getAssessment(assessmentId);
    if (!a) throw new AnalysisError("assessment not found", "config");

    const client = new Anthropic({ apiKey, maxRetries: 2, timeout: 12 * 60 * 1000 });
    const stream = client.beta.messages.stream({
      model: AI_MODEL,
      max_tokens: MAX_TOKENS,
      betas: [FALLBACK_BETA],
      fallbacks: "default",
      output_config: { effort: EFFORT },
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserMessage(a) }],
    });

    // Progress: written every few seconds, never two writes in flight.
    let chars = 0;
    let seen = "";
    let writing = false;
    let lastWrite = 0;
    const write = async (force = false) => {
      const now = Date.now();
      if (writing || (!force && now - lastWrite < 2500)) return;
      writing = true;
      lastWrite = now;
      try {
        await setProgress(assessmentId, lastStage, progressFrom(chars, (now - started) / 1000));
      } catch (e) {
        await captureFromUnknown(e, "ai/generate#progress", "server", { assessmentId });
      } finally {
        writing = false;
      }
    };
    stream.on("text", (delta) => {
      chars += delta.length;
      // keys can straddle two deltas, so search a short tail plus the new text
      seen = (seen.slice(-40) + delta).slice(-4000);
      const stage = stageFromText(seen);
      if (stage > lastStage) lastStage = stage;
      void write();
    });
    // while the model is still thinking nothing streams; keep the waiting screen moving
    const ticker = setInterval(() => void write(), 4000);

    let message: BetaMessage;
    try {
      message = await stream.finalMessage();
    } finally {
      clearInterval(ticker);
    }

    usage = {
      model: message.model,
      inputTokens: message.usage.input_tokens,
      outputTokens: message.usage.output_tokens,
      costMicros: costMicros(message.usage, message.model),
    };

    if (message.stop_reason === "refusal") {
      const cat = message.stop_details && "category" in message.stop_details ? String(message.stop_details.category ?? "") : "";
      throw new AnalysisError(`declined by the model${cat ? ` (${cat})` : ""}`, "refusal");
    }
    if (message.stop_reason === "max_tokens") throw new AnalysisError(`ran out of tokens at ${MAX_TOKENS}`, "truncated");

    let parsed: unknown;
    try {
      parsed = JSON.parse(extractJson(finalText(message)));
    } catch {
      throw new AnalysisError("the model returned text that is not JSON", "invalid");
    }
    const result = AiReportSchema.safeParse(normalizeReport(parsed));
    if (!result.success) {
      throw new AnalysisError(`the report did not match the schema: ${result.error.issues.slice(0, 3).map((i) => i.path.join(".")).join(", ")}`, "invalid");
    }
    const report: AiReport = result.data;
    const warnings = checkReport(report);
    if (warnings.length) {
      await captureError({
        name: "AnalysisWarning",
        message: `analysis saved with: ${warnings.join("; ")}`,
        route: "ai/generate",
        side: "server",
        severity: "warning",
        meta: { assessmentId },
      });
    }

    await finishJob(assessmentId, {
      output: report,
      model: usage.model,
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      costMicros: usage.costMicros,
      stage: STAGES.length - 1,
    });
  } catch (e) {
    const kind = e instanceof AnalysisError ? e.kind : e instanceof Anthropic.APIError ? "api" : "unknown";
    const msg = e instanceof Error ? e.message : String(e);
    try {
      await failJob(assessmentId, `${kind}: ${msg}`, usage);
    } catch (inner) {
      await captureFromUnknown(inner, "ai/generate#failJob", "server", { assessmentId });
    }
    await captureFromUnknown(e, "ai/generate", "server", { assessmentId, kind, seconds: Math.round((Date.now() - started) / 1000) });
  }
}
