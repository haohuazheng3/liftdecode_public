import { QUESTIONS, SCREENS } from "@/content/questions";
import { FINDINGS } from "@/content/findings";
import { FINDING_RULES } from "@/content/rules";
import { bmi, carbsPerKg, computeDerived, groupHours, groupSessionHours, GROUPS, proteinPerKg, weeklyHours } from "@/content/derived";
import type { Question, Track } from "@/content/types";
import type { Assessment } from "@/lib/assessments";
import { questionsForTrack } from "@/lib/engine/diagnose";
import { buildScorecard } from "@/lib/report/scorecard";
import { z } from "zod";
import { KNOWLEDGE } from "./knowledge";
import { AiReportSchema } from "./schema";

/**
 * What the model is told. The system prompt is the same for every lifter (voice, rules, the
 * engine's finding library, the evidence base); the user message is the lifter: every answer in
 * plain words, the numbers derived from them, the scorecard, and what the rule engine found.
 * The model writes the report as one JSON object matching ./schema.ts, given below as JSON Schema.
 */

function findingLibrary(): string {
  return FINDING_RULES.map((r) => {
    const c = FINDINGS[r.id];
    return `- ${r.id} [${r.category}, ${r.audience}]: "${c?.title ?? r.id}". ${c?.verdict ?? ""}`;
  }).join("\n");
}

export const SYSTEM_PROMPT = `You are the analyst behind LiftDecode (liftdecode.com), a paid diagnostic for lifters whose progress has stalled. The lifter has paid for this report. You write it from their questionnaire answers, the numbers derived from them, a scorecard, and the findings of LiftDecode's rule engine, all given in the next message.

# What the report must do
- Name what is wrong, directly. Never tell the lifter that nothing is wrong or that the programme is fine as it is. If the engine found little, the report is about the next levers: the weakest scorecard dimensions, explained and fixed.
- Make every claim specific to this lifter. Quote their numbers (kilograms, grams per kilo, hours, sessions, minutes, scores) and connect answers to each other: the value of the report is in the connections a lifter cannot see alone (for example, low carbs plus fasted training plus a flat pump; slow set-to-set recovery plus no cardio plus little leg work).
- Follow the engine's ranking unless the answers clearly show a different priority; if you reorder, say why in that problem's text. Cover every actionable engine finding (all except expecting_year_one_speed, which you may fold into the summary or retest note as context, never as a problem). If there are fewer than three, add the weakest scorecard dimensions as problems with findingId null.
- Give fixes a coach would sign: concrete numbers (grams of protein per day for their weight, sets per week, rest minutes, cardio minutes and intensity, bed and wake times), what to change first, and what to leave alone.
- Explain the science in plain words where it changes what they do: why a mechanism matters for them, in a sentence or two. The knowledge base below is your source for numbers and ranges.

# Hard rules
- Use only facts present in the lifter's answers, the derived numbers, the scorecard, the engine findings and the knowledge base. Never invent anything about the lifter (injuries, schedule, foods, job, history) and never invent statistics, studies, percentages or sources. When the knowledge base gives a range, use the range, with the population it was measured in.
- Cite the knowledge base. When a sentence rests on an entry, end the sentence with its id in square brackets, like [CARDIO-10] or [PROT-01, PROT-02]. Cite only ids that exist below, at most two per sentence, and only where the entry really supports the sentence. Never name authors, journals or years and never write URLs: the report turns the ids into linked sources. Aim for roughly 10-20 citations, mostly in the problems, the audits and the conditioning science.
- No medical diagnosis. Where a sign could be medical (dizziness, a racing heart, fainting, chest pain, breathlessness out of proportion, persistent cramps), add one plain line: if it happens away from training, or keeps happening, they should see a doctor. Never name a disease as the cause.
- The questionnaire never told the lifter that the training-signs list (cramps, twitches, floaty legs, dizziness or a racing heart, limp and powerless muscles) and the sweat question are about electrolytes. The report is where they learn it: explain the link plainly when it applies, and say that cramps have more than one cause.
- Bodyweight trend is measured over the last two months; "fast" means more than about 2 kg (4 lb) a month.
- Time per muscle group is per session, sets and rests included: an hour is roughly 12-18 hard sets. Weekly time is sessions times time per session; treat it as an estimate.
- Write about the lifter, not about the process: never mention the engine, rules, scores' formulas, the questionnaire's design, AI, a model or yourself. Say "your answers", not "the data". Never ask the lifter questions.
- LiftDecode is the brand; never sign as or mention a named person.

# Voice
Direct, warm, coach-grade, zero hype. Second person. Plain English for a reader who may not be a native speaker: short sentences, common words, explain any technical term the first time in a few words. No exclamation marks, no emoji, no clichés ("game-changer", "unlock your potential", "journey"), no filler openers. Numbers as digits. Be honest about uncertainty with words like "most", "roughly", "usually".

# Length
Around 2,500-3,500 words across all fields. Every field earns its place: no repetition between sections; the problems carry the depth, the audits carry the numbers, the plan carries the actions.

# Output
Reply with one JSON object and nothing else: no markdown fences, no text before or after it. It must match the JSON Schema below exactly: every property is required, no property may be added, enum fields use one of the listed values, and findingId is null only for a problem drawn from the scorecard. Write the properties in the order the schema lists them. Each description says what the field holds and how long it is. Inside strings, escape double quotes and use no line breaks.

${JSON.stringify(z.toJSONSchema(AiReportSchema))}

# The engine's finding library (id, category, audience: title. verdict)
${findingLibrary()}

# Knowledge base
${KNOWLEDGE}`;

const label = (q: Question, v: string | string[] | undefined): string | undefined => {
  if (v === undefined) return undefined;
  if (q.type === "scale") return typeof v === "string" ? `${v}/10 (1 = ${q.scale?.low}, 10 = ${q.scale?.high})` : undefined;
  if (q.type === "number") {
    if (typeof v !== "string") return undefined;
    const unit = q.number?.units[0]?.label;
    return unit && unit !== "years" ? `${v} ${unit}` : v;
  }
  const values = Array.isArray(v) ? v : [v];
  const labels = values.map((x) => q.options.find((o) => o.value === x)?.label ?? x);
  return labels.join(", ");
};

const fmt = (n: number | undefined, d = 1) => (n === undefined ? "unknown" : n.toFixed(d));

/** The lifter, in plain words, for the user message. */
export function buildUserMessage(a: Assessment): string {
  const track = (a.track === "strength" ? "strength" : "physique") as Track;
  const answers = a.answers;
  const derived = computeDerived(answers);
  const lines: string[] = [];

  lines.push(`# Lifter`);
  lines.push(`Track: ${track === "strength" ? "Strength (wants a bigger number on a stuck lift)" : "Physique (wants a better-looking body)"}`);

  lines.push(`\n# Every answer (question → answer)`);
  const asked = new Set<string>();
  for (const q of questionsForTrack(QUESTIONS, track)) {
    asked.add(q.id);
    const shown = label(q, answers[q.id]);
    // per-muscle-group fields share a screen and a prompt; the screen title says which group
    const group = q.screen && (GROUPS as readonly string[]).includes(q.screen) ? SCREENS.find((x) => x.id === q.screen)?.title : undefined;
    if (shown !== undefined) lines.push(`- ${group ? `${group.replace(/\.$/, "")}: ` : ""}${q.prompt} → ${shown}`);
  }
  const older = Object.keys(answers).filter((k) => !asked.has(k) && k !== "goal");
  if (older.length) {
    lines.push(`\nAnswers to questions from an older version of the questionnaire (raw values):`);
    for (const k of older) lines.push(`- ${k}: ${JSON.stringify(answers[k])}`);
  }

  lines.push(`\n# Derived numbers`);
  const h = Number(answers.height_cm);
  const w = Number(answers.weight_kg);
  const b = bmi(answers);
  if (b !== undefined) lines.push(`- BMI ${b.toFixed(1)} (${Number.isFinite(h) ? `${h} cm` : ""}, ${Number.isFinite(w) ? `${w} kg` : ""})`);
  const total = weeklyHours(answers);
  if (total !== undefined) {
    lines.push(`- Lifting time a week: about ${total.toFixed(1)} hours (band: ${derived.weekly_hours ?? "unknown"})`);
    for (const g of GROUPS) {
      const per = groupSessionHours(answers, g);
      const gh = groupHours(answers, g);
      const s = answers[`${g}_sessions`];
      lines.push(
        `  - ${g}: ${typeof s === "string" ? s.replace("plus", "+") : "?"} sessions × ${per !== undefined ? `${Math.round(per * 60)} min` : "?"} ≈ ${fmt(gh)} h a week (dose band: ${g === "legs" ? (derived.legs_dose ?? "?") : "see below"})`,
      );
    }
  }
  if (derived.lagging_dose) lines.push(`- Weekly dose of the slowest area: ${derived.lagging_dose}`);
  if (derived.lift_muscle_dose) lines.push(`- Weekly dose of the muscles behind the stuck lift: ${derived.lift_muscle_dose}`);
  if (derived.legs_share) lines.push(`- Legs' share of lifting time: ${derived.legs_share}`);
  if (derived.arms_share) lines.push(`- Arms' share of lifting time: ${derived.arms_share}`);
  const p = proteinPerKg(answers);
  const c = carbsPerKg(answers);
  lines.push(`- Protein: ${p !== undefined ? `≈ ${p.toFixed(2)} g/kg a day` : "not tracked"} (band: ${derived.protein_band ?? "unknown"})`);
  lines.push(`- Carbs: ${c !== undefined ? `≈ ${c.toFixed(2)} g/kg a day` : "not tracked"} (band: ${derived.carbs_band ?? "unknown"})`);
  if (derived.sleep_band) lines.push(`- Sleep band: ${derived.sleep_band}`);
  if (derived.age_band) lines.push(`- Age band: ${derived.age_band}`);
  if (derived.signs_count) lines.push(`- Training signs: ${derived.signs_count}`);

  lines.push(`\n# Scorecard (0-100 per dimension; each item 0-1, where 1 is what a coach would sign off)`);
  for (const d of buildScorecard(answers, track)) {
    lines.push(`- ${d.id} "${d.label}": ${d.score}`);
    for (const i of d.items) lines.push(`  - ${i.fact} → ${i.value.toFixed(2)}`);
  }

  const r = a.result;
  lines.push(`\n# Engine findings, ranked (score / threshold; the lines are the answers that triggered each)`);
  if (!r.findings.length) lines.push(`(none above threshold)`);
  r.findings.forEach((f, i) => {
    const rule = FINDING_RULES.find((x) => x.id === f.id);
    lines.push(`${i + 1}. ${f.id} — "${FINDINGS[f.id]?.title ?? f.id}" (${f.score} / ${rule?.threshold ?? "?"})`);
    for (const t of f.triggers) lines.push(`   - ${t.because}`);
  });
  if (r.suppressed.length) lines.push(`Suppressed by a stronger related finding: ${r.suppressed.join(", ")}`);

  lines.push(`\n# Ruled out (clearances)`);
  if (!r.clearances.length) lines.push(`(none)`);
  for (const cl of r.clearances) lines.push(`- ${cl.title}: ${cl.text}`);

  lines.push(`\nWrite this lifter's report now, filling every field of the schema.`);
  return lines.join("\n");
}
