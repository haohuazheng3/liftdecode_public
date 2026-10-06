import { QUESTIONS } from "@/content/questions";
import { GROUPS, bmi, carbsPerKg, groupHours, groupSessions, proteinPerKg, weeklyHours } from "@/content/derived";
import type { Answers } from "@/lib/db/schema";

/**
 * The numbers the intake collected, ready to print. Shown on the preview and the report so
 * the reader sees their own build read back before a single finding — proof the report is
 * about them, not a template.
 */
export interface ProfileStat {
  label: string;
  value: string;
  note?: string;
}

const label = (qid: string, value: string | string[] | undefined): string | undefined => {
  if (typeof value !== "string") return undefined;
  const q = QUESTIONS.find((x) => x.id === qid);
  return q?.options.find((o) => o.value === value)?.label;
};

function cmToFtIn(cm: number): string {
  const inches = cm / 2.54;
  const ft = Math.floor(inches / 12);
  const rest = Math.round(inches - ft * 12);
  return `${ft}'${rest}"`;
}

export function buildProfile(answers: Answers): ProfileStat[] {
  const out: ProfileStat[] = [];
  const h = Number(answers.height_cm);
  const w = Number(answers.weight_kg);
  const age = Number(answers.age);
  const sex = label("sex", answers.sex);
  const body = label("body_type", answers.body_type);

  if (Number.isFinite(h) && Number.isFinite(w)) {
    out.push({ label: "Build", value: `${Math.round(h)} cm · ${w} kg`, note: `${cmToFtIn(h)} · ${Math.round(w / 0.45359237)} lb` });
    const b = bmi(answers);
    if (b !== undefined) {
      out.push({
        label: "BMI",
        value: b.toFixed(1),
        note: b < 18.5 ? "under 18.5" : b < 25 ? "18.5–25" : b < 30 ? "25–30" : "over 30",
      });
    }
  }
  const who: string[] = [];
  if (sex && answers.sex !== "other") who.push(sex);
  if (Number.isFinite(age)) who.push(`${age}`);
  if (body) who.push(body);
  if (who.length) out.push({ label: "You", value: who.join(" · ") });

  const total = weeklyHours(answers);
  if (total !== undefined) {
    const parts = GROUPS.map((g) => {
      const sessions = label(`${g}_sessions`, answers[`${g}_sessions`]);
      const per = label(`${g}_time`, answers[`${g}_time`]);
      if (sessions && per) return sessions === "0" ? `${g} none` : `${g} ${sessions}× ${per}`;
      // assessments stored before v4 carry weekly hours per group instead of time per session
      const hrs = groupHours(answers, g);
      return `${g} ${hrs?.toFixed(1) ?? "?"} h / ${groupSessions(answers, g) ?? "?"}×`;
    });
    const sessions = label("sessions_week", answers.sessions_week);
    out.push({
      label: "Lifting a week",
      value: `≈ ${total.toFixed(1)} h${sessions ? ` over ${sessions} sessions` : ""}`,
      note: parts.join(" · "),
    });
  }

  const p = proteinPerKg(answers);
  const c = carbsPerKg(answers);
  const pLabel = label("protein_g", answers.protein_g);
  const cLabel = label("carbs_g", answers.carbs_g);
  if (pLabel) {
    out.push({
      label: "Protein",
      value: answers.protein_g === "unknown" ? "Not tracked" : `${pLabel} g/day`,
      note: p !== undefined ? `≈ ${p.toFixed(1)} g per kg` : undefined,
    });
  }
  if (cLabel) {
    out.push({
      label: "Carbs",
      value: answers.carbs_g === "unknown" ? "Not tracked" : `${cLabel} g/day`,
      note: c !== undefined ? `≈ ${c.toFixed(1)} g per kg` : undefined,
    });
  }

  const trend = label("weight_trend", answers.weight_trend);
  if (trend) out.push({ label: "Bodyweight, last 2 months", value: trend });

  const sl = label("sleep_hours", answers.sleep_hours);
  const reg = label("sleep_regular", answers.sleep_regular);
  if (sl) out.push({ label: "Sleep", value: `${sl} h a night`, note: reg ? `Bed and wake times: ${reg.toLowerCase()}` : undefined });

  const coffee = label("coffee", answers.coffee);
  if (coffee) out.push({ label: "Caffeine", value: coffee === "None" ? "None" : `${coffee} cup${coffee === "1" ? "" : "s"} a day` });

  const cardio = label("cardio_sessions", answers.cardio_sessions);
  const sweat = label("sweat_level", answers.sweat_level);
  if (cardio) {
    out.push({
      label: "Cardio",
      value: `${cardio} session${cardio === "1" ? "" : "s"} a week`,
      note: sweat ? `Sweat: ${sweat.toLowerCase()}` : undefined,
    });
  }

  return out;
}
