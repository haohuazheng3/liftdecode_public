"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS, SCREENS } from "@/content/questions";
import type { Question, Track } from "@/content/types";
import { screensForTrack, type QuizScreen } from "@/lib/engine/diagnose";
import { validateAnswer } from "@/lib/engine/validate";
import { track as fwTrack } from "@/components/Analytics";
import { AnalyzingScreen } from "./AnalyzingScreen";
import { ChoiceInput, GoalInput } from "./ChoiceInput";
import { ScaleInput } from "./ScaleInput";
import { PillsInput } from "./PillsInput";
import { NumberInput } from "./NumberInput";
import { ImageChoiceInput } from "./ImageChoiceInput";
import { MultiInput } from "./MultiInput";

/*
 * The quiz deliberately never says how long it is: no progress bar, no
 * "question N of M", no chapters, no counts anywhere (also not on resume).
 * One screen at a time; a tap answers a one-question screen and the next slides in.
 * Screens with typed numbers, several questions or a pick-any list show "Next".
 */

type Answers = Record<string, string | string[]>;

interface Saved {
  v: 3;
  track: Track | null;
  answers: Answers;
  index: number;
  startedAt: number;
  updatedAt: number;
}

const KEY = "ld_quiz_v3";
const LEGACY_KEYS = ["ld_quiz_v1", "ld_quiz_v2"];
const GOAL_ID = "goal";
const ADVANCE_MS = 220;
const PROMPT_ID = "q-prompt";
/** Same ceiling the submit route accepts; beyond it the number no longer means answering time. */
const MAX_DURATION_S = 60 * 60 * 6;

const BY_ID = new Map(QUESTIONS.map((q) => [q.id, q]));

function isValidAnswer(q: Question, v: unknown): boolean {
  return validateAnswer(q, v) !== undefined;
}

/** A saved run is only usable if every answer still matches the current question bank. */
function isValidSaved(s: unknown): s is Saved {
  if (!s || typeof s !== "object") return false;
  const o = s as Partial<Saved>;
  if (o.v !== 3) return false;
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

function screensFor(track: Track | null): QuizScreen[] {
  const goal = BY_ID.get(GOAL_ID);
  if (!track) return goal ? [{ id: GOAL_ID, questions: [goal] }] : [];
  return screensForTrack(QUESTIONS, SCREENS, track);
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

/** every question on the screen has a valid answer */
function complete(screen: QuizScreen, answers: Answers): boolean {
  return screen.questions.every((q) => isValidAnswer(q, answers[q.id]));
}
/** a screen made only of taps advances by itself once complete; typed or pick-any screens need "Next" */
function autoAdvances(screen: QuizScreen): boolean {
  return screen.questions.every((q) => q.type === "single" || q.type === "scale" || q.type === "pills" || q.type === "image");
}
function firstGap(screens: QuizScreen[], answers: Answers): number {
  return screens.findIndex((s) => !complete(s, answers));
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

  const screens = useMemo(() => screensFor(track), [track]);
  const screen = screens[Math.min(index, screens.length - 1)];
  const isLast = track !== null && index >= screens.length - 1;

  const cancelAdvance = useCallback(() => {
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    advanceTimer.current = null;
  }, []);

  // persist
  useEffect(() => {
    if (!ready || resume) return;
    save({ v: 3, track, answers, index, startedAt: startedAt || Date.now(), updatedAt: Date.now() });
  }, [ready, resume, track, answers, index, startedAt]);

  useEffect(() => cancelAdvance, [cancelAdvance]);

  // Slide the new screen in from the side we're moving toward. Web Animations keeps
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
  }, [screen?.id]);

  // Each screen re-mounts (key={screen.id}), so the control that had focus is gone. Move focus
  // to the new headline: screen readers announce it, keyboard users keep their place.
  useEffect(() => {
    if (resume || submitting) return;
    titleRef.current?.focus({ preventScroll: true });
  }, [screen?.id, resume, submitting]);

  const goNext = useCallback(() => {
    cancelAdvance();
    setError(null);
    direction.current = 1;
    setIndex((i) => Math.min(i + 1, screens.length - 1));
    scrollTop();
  }, [screens.length, cancelAdvance]);

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
    const gap = firstGap(screens, answers);
    if (gap !== -1) {
      direction.current = -1;
      setIndex(gap);
      scrollTop();
      return;
    }
    setSubmitting(true);
    setError(null);
    fwTrack("quiz_complete", { track });
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
  }, [track, submitting, answers, screens, startedAt, router, cancelAdvance]);

  /** a tap on a choice, pill, scale or photo: instant local state, then maybe advance */
  const select = useCallback(
    (question: Question, value: string) => {
      setError(null);
      cancelAdvance();
      const next = { ...answers, [question.id]: value };
      setAnswers(next);

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
      if (!screen || !autoAdvances(screen) || !complete(screen, next)) return;
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
    [answers, screen, track, isLast, goNext, cancelAdvance],
  );

  /** typed numbers and pick-any lists: store what's valid, never advance by themselves */
  const setValue = useCallback(
    (question: Question, value: string | string[] | undefined) => {
      setError(null);
      setAnswers((a) => {
        const next = { ...a };
        if (value === undefined || (Array.isArray(value) && value.length === 0)) delete next[question.id];
        else next[question.id] = value;
        return next;
      });
    },
    [],
  );

  const answered = screen ? complete(screen, answers) : false;
  const needsNext = screen ? !autoAdvances(screen) : false;

  useEffect(() => {
    if (!focusCta.current || !answered || !isLast) return;
    focusCta.current = false;
    const el = ctaRef.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    el.scrollIntoView({ block: "nearest", behavior: reducedMotion() ? "auto" : "smooth" });
  }, [answered, isLast]);

  // keyboard: on one-question tap screens 1–9 and 0 (= 10) answer; ArrowLeft / Backspace go back; Enter continues
  useEffect(() => {
    if (!screen || submitting || resume) return;
    const single = screen.questions.length === 1 ? screen.questions[0] : null;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) {
        // typing in a number field: Enter continues once the screen is complete
        if (e.key === "Enter" && answered) {
          e.preventDefault();
          if (isLast) void submit();
          else goNext();
        }
        return;
      }
      if (/^[0-9]$/.test(e.key) && single && (single.type === "scale" || single.type === "single" || single.type === "pills")) {
        const n = e.key === "0" ? 10 : Number(e.key);
        if (single.type === "scale") {
          const max = single.scale?.max ?? 10;
          if (n <= max) select(single, String(n));
        } else {
          const opt = single.options[n - 1];
          if (opt) select(single, opt.value);
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
  }, [screen, answered, isLast, index, submitting, resume, select, submit, goNext, goBack]);

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
              const list = screensFor(resume.track);
              // The bank may have gained or reordered screens since this run was saved:
              // land on the first incomplete one, never past it.
              const gap = firstGap(list, resume.answers);
              setTrack(resume.track);
              setAnswers(resume.answers);
              setIndex(gap === -1 ? list.length - 1 : Math.min(gap, resume.index));
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

  if (!screen) return null;

  const shared = screen.questions.length > 1;
  const single = screen.questions[0];
  const isGoal = single.id === GOAL_ID;
  const title = screen.screen?.title ?? single.prompt;
  const sex = typeof answers.sex === "string" ? answers.sex : undefined;

  const renderInput = (q: Question, labelledBy: string, first: boolean) => {
    const value = answers[q.id];
    const current = Array.isArray(value) ? value[0] : value;
    switch (q.type) {
      case "scale":
        return (
          <ScaleInput labelledBy={labelledBy} value={current} low={q.scale?.low ?? ""} high={q.scale?.high ?? ""} onSelect={(v) => select(q, v)} />
        );
      case "pills":
        return <PillsInput labelledBy={labelledBy} options={q.options} value={current} onSelect={(v) => select(q, v)} />;
      case "number":
        return (
          <NumberInput
            id={q.id}
            label={q.prompt}
            spec={q.number!}
            value={current}
            onChange={(v) => setValue(q, v)}
            autoFocus={first && !shared}
          />
        );
      case "image":
        return <ImageChoiceInput labelledBy={labelledBy} options={q.options} value={current} sex={sex} onSelect={(v) => select(q, v)} />;
      case "multi":
        return (
          <MultiInput
            labelledBy={labelledBy}
            options={q.options}
            value={Array.isArray(value) ? value : []}
            maxSelect={q.maxSelect}
            onChange={(v) => setValue(q, v)}
          />
        );
      default:
        return isGoal ? (
          <GoalInput labelledBy={labelledBy} options={q.options} value={current} onSelect={(v) => select(q, v)} />
        ) : (
          <ChoiceInput labelledBy={labelledBy} options={q.options} value={current} onSelect={(v) => select(q, v)} />
        );
    }
  };

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

        <div key={screen.id} ref={stageRef}>
          <h1
            ref={titleRef}
            id={PROMPT_ID}
            tabIndex={-1}
            className="display text-[2.15rem] leading-[1.02] sm:text-5xl outline-none text-balance"
          >
            {title}
          </h1>
          {(screen.screen?.lead ?? (!shared ? single.help : undefined)) && (
            <p className="mt-3 text-[0.95rem] sm:text-base leading-relaxed text-ink-2 max-w-xl">
              {screen.screen?.lead ?? single.help}
            </p>
          )}

          <div className="mt-7 sm:mt-9">
            {shared ? (
              <div className="space-y-6 sm:space-y-7">
                {screen.questions.map((q, i) => {
                  const labelId = `q-${q.id}`;
                  return (
                    <div key={q.id}>
                      <div id={labelId} className="mb-2.5 text-[0.95rem] font-semibold text-ink">
                        {q.prompt}
                      </div>
                      {q.help && <p className="-mt-1 mb-2.5 text-sm leading-relaxed text-ink-3">{q.help}</p>}
                      {renderInput(q, labelId, i === 0)}
                    </div>
                  );
                })}
              </div>
            ) : (
              renderInput(single, PROMPT_ID, true)
            )}
          </div>

          {answered && (isLast || needsNext) && (
            <button
              ref={ctaRef}
              type="button"
              className="btn btn-primary btn-lg w-full mt-7 animate-rise"
              onClick={() => (isLast ? void submit() : goNext())}
            >
              {isLast ? (
                <>
                  See my diagnosis <span aria-hidden="true">→</span>
                </>
              ) : (
                <>
                  Next <span aria-hidden="true">→</span>
                </>
              )}
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
