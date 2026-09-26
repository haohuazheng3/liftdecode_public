"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS } from "@/content/questions";
import type { Question, Track } from "@/content/types";
import { questionsForTrack } from "@/lib/engine/diagnose";
import { track as fwTrack } from "@/components/Analytics";
import { AnalyzingScreen } from "./AnalyzingScreen";
import { ChoiceInput, GoalInput } from "./ChoiceInput";
import { ScaleInput } from "./ScaleInput";

/*
 * The quiz deliberately never says how long it is: no progress bar, no
 * "question N of M", no chapters, no counts anywhere (also not on resume).
 * One question per screen, a tap answers it, the next one slides in.
 */

type Answers = Record<string, string | string[]>;

interface Saved {
  v: 2;
  track: Track | null;
  answers: Answers;
  index: number;
  startedAt: number;
  updatedAt: number;
}

const KEY = "ld_quiz_v2";
const LEGACY_KEYS = ["ld_quiz_v1"];
const GOAL_ID = "goal";
const ADVANCE_MS = 220;
const PROMPT_ID = "q-prompt";
/** Same ceiling the submit route accepts; beyond it the number no longer means answering time. */
const MAX_DURATION_S = 60 * 60 * 6;

const BY_ID = new Map(QUESTIONS.map((q) => [q.id, q]));

function isValidAnswer(q: Question, v: unknown): boolean {
  if (q.type === "scale") {
    if (typeof v !== "string") return false;
    const n = Number(v);
    return Number.isInteger(n) && n >= (q.scale?.min ?? 1) && n <= (q.scale?.max ?? 10);
  }
  const valid = new Set(q.options.map((o) => o.value));
  if (q.type === "single") return typeof v === "string" && valid.has(v);
  return Array.isArray(v) && v.length > 0 && v.every((x) => typeof x === "string" && valid.has(x));
}

/** A saved run is only usable if every answer still matches the current question bank. */
function isValidSaved(s: unknown): s is Saved {
  if (!s || typeof s !== "object") return false;
  const o = s as Partial<Saved>;
  if (o.v !== 2) return false;
  if (o.track !== null && o.track !== "physique" && o.track !== "strength") return false;
  if (!o.answers || typeof o.answers !== "object") return false;
  if (typeof o.index !== "number" || !Number.isInteger(o.index) || o.index < 0) return false;
  if (typeof o.startedAt !== "number" || !Number.isFinite(o.startedAt)) return false;
  for (const [id, v] of Object.entries(o.answers)) {
    const q = BY_ID.get(id);
    if (!q || !isValidAnswer(q, v)) return false;
  }
  return true;
}

function load(): Saved | null {
  try {
    for (const k of LEGACY_KEYS) localStorage.removeItem(k);
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const s: unknown = JSON.parse(raw);
    if (isValidSaved(s)) return s;
    localStorage.removeItem(KEY);
    return null;
  } catch (e) {
    console.warn("[quiz] load failed", e);
    return null;
  }
}
function save(s: Saved) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch (e) {
    console.warn("[quiz] save failed", e);
  }
}
function clear() {
  try {
    localStorage.removeItem(KEY);
  } catch (e) {
    console.warn("[quiz] clear failed", e);
  }
}

function listFor(track: Track | null): Question[] {
  const goal = BY_ID.get(GOAL_ID);
  if (!track) return goal ? [goal] : [];
  return questionsForTrack(QUESTIONS, track);
}

function trackOf(v: string): Track | null {
  return v === "physique" || v === "strength" ? v : null;
}

/** A saved run worth offering to resume: has a track and more than the goal answer. */
function resumable(): Saved | null {
  if (typeof window === "undefined") return null;
  const s = load();
  return s && s.track && Object.keys(s.answers).length > 1 ? s : null;
}

function reducedMotion(): boolean {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

function scrollTop() {
  if (window.scrollY > 0) window.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" });
}

// localStorage is browser-only. `ready` is false on the server and during hydration
// (skeleton), then true on the client; the saved run is read once, lazily, on the client.
const subscribeNoop = () => () => {};
const readyInBrowser = () => true;
const readyOnServer = () => false;

export function Quiz() {
  const router = useRouter();
  const ready = useSyncExternalStore(subscribeNoop, readyInBrowser, readyOnServer);
  const [resume, setResume] = useState<Saved | null>(resumable);
  const [track, setTrack] = useState<Track | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [index, setIndex] = useState(0);
  const [startedAt, setStartedAt] = useState<number>(() => Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const advanceTimer = useRef<number | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const direction = useRef<1 | -1 | 0>(0);
  const focusCta = useRef(false);

  const list = useMemo(() => listFor(track), [track]);
  const q = list[Math.min(index, list.length - 1)];
  const isLast = track !== null && index >= list.length - 1;

  const cancelAdvance = useCallback(() => {
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    advanceTimer.current = null;
  }, []);

  // persist
  useEffect(() => {
    if (!ready || resume) return;
    save({ v: 2, track, answers, index, startedAt: startedAt || Date.now(), updatedAt: Date.now() });
  }, [ready, resume, track, answers, index, startedAt]);

  useEffect(() => cancelAdvance, [cancelAdvance]);

  // Slide the new question in from the side we're moving toward. Web Animations keeps
  // it self-contained; reduced motion gets no movement at all.
  useLayoutEffect(() => {
    const el = stageRef.current;
    const dir = direction.current;
    direction.current = 0;
    if (!el || dir === 0 || reducedMotion() || typeof el.animate !== "function") return;
    el.animate(
      [
        { opacity: 0, transform: `translateX(${dir * 28}px)` },
        { opacity: 1, transform: "translateX(0)" },
      ],
      { duration: 200, easing: "cubic-bezier(0.25, 1, 0.5, 1)" },
    );
  }, [q?.id]);

  // Each question re-mounts (key={q.id}), so the radio that had focus is gone. Move focus
  // to the new prompt: screen readers announce the question, keyboard users keep their place.
  useEffect(() => {
    if (resume || submitting) return;
    titleRef.current?.focus({ preventScroll: true });
  }, [q?.id, resume, submitting]);

  const goNext = useCallback(() => {
    cancelAdvance();
    setError(null);
    direction.current = 1;
    setIndex((i) => Math.min(i + 1, list.length - 1));
    scrollTop();
  }, [list.length, cancelAdvance]);

  const goBack = useCallback(() => {
    cancelAdvance();
    setError(null);
    direction.current = -1;
    setIndex((i) => Math.max(0, i - 1));
  }, [cancelAdvance]);

  const submit = useCallback(async () => {
    if (!track || submitting) return;
    cancelAdvance();
    // Safety net: never post a run with a hole in it — take the user to the first gap instead.
    const gap = list.findIndex((item) => answers[item.id] === undefined);
    if (gap !== -1) {
      direction.current = -1;
      setIndex(gap);
      scrollTop();
      return;
    }
    setSubmitting(true);
    setError(null);
    fwTrack("quiz_complete", { track, questions: list.length });
    const started = Date.now();
    try {
      const res = await fetch("/api/diagnose/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          track,
          answers,
          durationSeconds: Math.min(
            MAX_DURATION_S,
            Math.max(0, Math.round((Date.now() - (startedAt || Date.now())) / 1000)),
          ),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { id?: string; error?: string };
      if (!res.ok || !data.id) throw new Error(data.error ?? "Could not save your answers");
      // keep the reveal moment at least ~2.6s so the analysis is felt, not flashed
      const wait = Math.max(0, 2600 - (Date.now() - started));
      await new Promise((r) => setTimeout(r, wait));
      clear();
      router.push(`/diagnose/result/${data.id}`);
    } catch (e) {
      console.warn("[quiz] submit failed", e);
      setSubmitting(false);
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  }, [track, submitting, answers, list, startedAt, router, cancelAdvance]);

  const select = useCallback(
    (question: Question, value: string) => {
      setError(null);
      cancelAdvance();
      // instant local state first; the move to the next screen follows a beat later
      setAnswers((a) => ({ ...a, [question.id]: question.type === "multi" ? [value] : value }));

      if (question.id === GOAL_ID) {
        const t = trackOf(value);
        if (t !== track) fwTrack("quiz_start", { track: t });
        setTrack(t);
        advanceTimer.current = window.setTimeout(() => {
          advanceTimer.current = null;
          direction.current = 1;
          setIndex(1);
          scrollTop();
        }, ADVANCE_MS);
        return;
      }
      if (isLast) {
        // the ending is deliberate: no auto-submit, hand focus to the button instead
        focusCta.current = true;
        return;
      }
      advanceTimer.current = window.setTimeout(() => {
        advanceTimer.current = null;
        goNext();
      }, ADVANCE_MS);
    },
    [track, isLast, goNext, cancelAdvance],
  );

  const value = q ? answers[q.id] : undefined;
  const current = Array.isArray(value) ? value[0] : value;
  const answered = current !== undefined && current !== "";

  useEffect(() => {
    if (!focusCta.current || !answered || !isLast) return;
    focusCta.current = false;
    const el = ctaRef.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    el.scrollIntoView({ block: "nearest", behavior: reducedMotion() ? "auto" : "smooth" });
  }, [answered, isLast]);

  // keyboard: 1–9 and 0 (= 10) answer, ArrowLeft / Backspace go back, Enter finishes
  useEffect(() => {
    if (!q || submitting || resume) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) return;
      if (/^[0-9]$/.test(e.key)) {
        const n = e.key === "0" ? 10 : Number(e.key);
        if (q.type === "scale") {
          const max = q.scale?.max ?? 10;
          if (n <= max) select(q, String(n));
        } else {
          const opt = q.options[n - 1];
          if (opt) select(q, opt.value);
        }
      } else if (e.key === "Enter") {
        // Enter on a focused button is that button's own click, not "continue".
        if (target?.closest?.("button")) return;
        if (!answered) return;
        e.preventDefault();
        if (isLast) void submit();
        else goNext();
      } else if (e.key === "Backspace" || e.key === "ArrowLeft") {
        // arrows inside a radiogroup move focus between its options
        if (e.key === "ArrowLeft" && target?.closest?.('[role="radiogroup"]')) return;
        if (index > 0) {
          e.preventDefault();
          goBack();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [q, answered, isLast, index, submitting, resume, select, submit, goNext, goBack]);

  if (!ready) return <QuizSkeleton />;

  if (resume) {
    return (
      <div className="slab p-6 sm:p-8 animate-rise">
        <div className="eyebrow mb-3">Welcome back</div>
        <h2 className="display text-4xl sm:text-5xl leading-[1.02]">
          Pick up where you <em>left off</em>?
        </h2>
        <p className="mt-3 text-ink-2">Your answers are still here.</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              const list = listFor(resume.track);
              // The bank may have gained or reordered questions since this run was saved:
              // land on the first unanswered one, never past it.
              const firstGap = list.findIndex((item) => resume.answers[item.id] === undefined);
              setTrack(resume.track);
              setAnswers(resume.answers);
              setIndex(firstGap === -1 ? list.length - 1 : Math.min(firstGap, resume.index));
              setStartedAt(resume.startedAt || Date.now());
              setResume(null);
              fwTrack("quiz_resume", { track: resume.track });
            }}
          >
            Continue
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              clear();
              setResume(null);
              setStartedAt(Date.now());
            }}
          >
            Start over
          </button>
        </div>
      </div>
    );
  }

  if (submitting) return <AnalyzingScreen track={track} error={error} onRetry={submit} />;

  if (!q) return null;

  const isGoal = q.id === GOAL_ID;

  return (
    <div className="slab overflow-hidden animate-rise">
      <div className="p-4 min-[400px]:p-5 sm:p-8">
        <div className="h-11 -ml-2 mb-3 sm:mb-5 flex items-center">
          {index > 0 && (
            <button type="button" className="btn btn-quiet btn-sm !px-3" onClick={goBack}>
              <span aria-hidden="true">←</span> Back
            </button>
          )}
        </div>

        <div key={q.id} ref={stageRef}>
          <h1
            ref={titleRef}
            id={PROMPT_ID}
            tabIndex={-1}
            className="display text-[2.15rem] leading-[1.02] sm:text-5xl outline-none text-balance"
          >
            {q.prompt}
          </h1>

          <div className="mt-7 sm:mt-9">
            {isGoal ? (
              <GoalInput
                labelledBy={PROMPT_ID}
                options={q.options}
                value={current}
                onSelect={(v) => select(q, v)}
              />
            ) : q.type === "scale" ? (
              <ScaleInput
                labelledBy={PROMPT_ID}
                value={current}
                low={q.scale?.low ?? ""}
                high={q.scale?.high ?? ""}
                onSelect={(v) => select(q, v)}
              />
            ) : (
              <ChoiceInput
                labelledBy={PROMPT_ID}
                options={q.options}
                value={current}
                onSelect={(v) => select(q, v)}
              />
            )}
          </div>

          {isLast && answered && (
            <button
              ref={ctaRef}
              type="button"
              className="btn btn-primary btn-lg w-full mt-7 animate-rise"
              onClick={() => void submit()}
            >
              See my diagnosis <span aria-hidden="true">→</span>
            </button>
          )}
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm text-alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

/** Shaped like a question screen: back pill, a two-line headline, the 5×2 (sm: 1×10) scale grid. */
function QuizSkeleton() {
  return (
    <div className="slab p-4 min-[400px]:p-5 sm:p-8" aria-hidden="true">
      <div className="skeleton h-9 w-20 mb-3 sm:mb-5 rounded-full" />
      <div className="skeleton h-9 sm:h-11 w-11/12 mb-2.5" />
      <div className="skeleton h-9 sm:h-11 w-2/3" />
      <div className="mt-7 sm:mt-9 grid grid-cols-5 gap-2 sm:grid-cols-10">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="skeleton h-14 sm:h-16 rounded-[12px] sm:rounded-2xl" />
        ))}
      </div>
      <div className="mt-3 flex justify-between">
        <div className="skeleton h-3 w-14" />
        <div className="skeleton h-3 w-14" />
      </div>
    </div>
  );
}
