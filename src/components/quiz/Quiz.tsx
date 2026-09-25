"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS, SECTIONS } from "@/content/questions";
import type { Question, Track } from "@/content/types";
import { questionsForTrack } from "@/lib/engine/diagnose";
import { track as fwTrack } from "@/components/Analytics";
import { AnalyzingScreen } from "./AnalyzingScreen";

type Answers = Record<string, string | string[]>;

interface Saved {
  v: 1;
  track: Track | null;
  answers: Answers;
  index: number;
  startedAt: number;
  updatedAt: number;
}

const KEY = "ld_quiz_v1";
const GOAL_ID = "goal";

function load(): Saved | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Saved;
    if (s?.v !== 1) return null;
    return s;
  } catch {
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
  const goal = QUESTIONS.find((q) => q.id === GOAL_ID);
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

  const list = useMemo(() => listFor(track), [track]);
  const total = track ? list.length : 0;
  const q = list[Math.min(index, list.length - 1)];
  const isLast = track !== null && index >= list.length - 1;

  // persist
  useEffect(() => {
    if (!ready || resume) return;
    save({ v: 1, track, answers, index, startedAt: startedAt || Date.now(), updatedAt: Date.now() });
  }, [ready, resume, track, answers, index, startedAt]);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    };
  }, []);

  // Each question re-mounts (key={q.id}), so the option that had focus is gone. Move focus
  // to the new title: screen readers announce the question, keyboard users keep their place.
  useEffect(() => {
    if (resume) return;
    titleRef.current?.focus({ preventScroll: true });
  }, [q?.id, resume]);

  const goNext = useCallback(() => {
    setError(null);
    setIndex((i) => Math.min(i + 1, list.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [list.length]);

  const goBack = useCallback(() => {
    setError(null);
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const submit = useCallback(async () => {
    if (!track || submitting) return;
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
          durationSeconds: Math.max(0, Math.round((Date.now() - (startedAt || Date.now())) / 1000)),
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
      setSubmitting(false);
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  }, [track, submitting, answers, list.length, startedAt, router]);

  const select = useCallback(
    (question: Question, value: string) => {
      setError(null);
      if (question.type === "single") {
        setAnswers((a) => ({ ...a, [question.id]: value }));
        if (question.id === GOAL_ID) {
          const t = trackOf(value);
          setTrack(t);
          fwTrack("quiz_start", { track: t });
          if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
          advanceTimer.current = window.setTimeout(() => setIndex(1), 260);
          return;
        }
        if (index < list.length - 1) {
          if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
          advanceTimer.current = window.setTimeout(goNext, 240);
        }
      } else {
        setAnswers((a) => {
          const cur = Array.isArray(a[question.id]) ? (a[question.id] as string[]) : [];
          const has = cur.includes(value);
          // "none"-style options are exclusive: picking one clears the rest, picking another clears it.
          const exclusive = (v: string) => /^(none|no_|nothing)/.test(v);
          let next = has
            ? cur.filter((v) => v !== value)
            : exclusive(value)
              ? [value]
              : [...cur.filter((v) => !exclusive(v)), value];
          if (question.maxSelect && next.length > question.maxSelect) next = next.slice(next.length - question.maxSelect);
          return { ...a, [question.id]: next };
        });
      }
    },
    [index, list.length, goNext],
  );

  // keyboard
  useEffect(() => {
    if (!q || submitting || resume) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (/^[1-9]$/.test(e.key)) {
        const opt = q.options[Number(e.key) - 1];
        if (opt) select(q, opt.value);
      } else if (e.key === "Enter") {
        // Enter on a focused button is that button's own click (toggle an option, go back…), not "continue".
        if (target?.closest?.("button")) return;
        const v = answers[q.id];
        const answered = Array.isArray(v) ? v.length > 0 : Boolean(v);
        if (!answered) return;
        if (isLast) void submit();
        else goNext();
      } else if (e.key === "Backspace" || e.key === "ArrowLeft") {
        if (index > 0) goBack();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [q, answers, isLast, index, submitting, resume, select, submit, goNext, goBack]);

  if (!ready) {
    return (
      <div className="slab p-6 sm:p-8">
        <div className="skeleton h-3 w-24 mb-6" />
        <div className="skeleton h-8 w-3/4 mb-3" />
        <div className="skeleton h-5 w-1/2 mb-8" />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-14 w-full mb-3" />
        ))}
      </div>
    );
  }

  if (resume) {
    const answered = Object.keys(resume.answers).length;
    return (
      <div className="slab p-6 sm:p-8 animate-rise">
        <div className="eyebrow mb-3">Welcome back</div>
        <h2 className="display text-3xl sm:text-4xl">
          You&rsquo;d answered <em>{answered}</em> questions.
        </h2>
        <p className="mt-3 text-ink-2">Pick up where you left off, or start a clean run.</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setTrack(resume.track);
              setAnswers(resume.answers);
              setIndex(Math.min(resume.index, listFor(resume.track).length - 1));
              setStartedAt(resume.startedAt || Date.now());
              setResume(null);
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

  if (submitting) return <AnalyzingScreen track={track} count={list.length} error={error} onRetry={submit} />;

  if (!q) return null;

  const section = SECTIONS.find((s) => s.id === q.section);
  const prev = index > 0 ? list[index - 1] : null;
  const newChapter = !prev || prev.section !== q.section;
  const chapterIndex = track ? Array.from(new Set(list.map((x) => x.section))).indexOf(q.section) + 1 : 0;
  const chapterCount = track ? new Set(list.map((x) => x.section)).size : 0;
  const value = answers[q.id];
  const answered = Array.isArray(value) ? value.length > 0 : Boolean(value);
  const progress = track ? Math.round(((index + (answered ? 1 : 0)) / total) * 100) : 0;
  const isGoal = q.id === GOAL_ID;

  return (
    <div className="animate-rise">
      <div className="slab overflow-hidden">
        {/* progress */}
        <div className="h-1 bg-white/[0.05]">
          <div
            className="h-full bg-signal transition-[width] duration-300 ease-out"
            style={{ width: `${track ? progress : 4}%` }}
            aria-hidden="true"
          />
        </div>

        <div className="p-5 sm:p-8">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="eyebrow">
              {track ? (
                <>
                  Question {String(index + 1).padStart(2, "0")} / {total}
                </>
              ) : (
                "Before we start"
              )}
            </div>
            {track && section && (
              <div className="eyebrow text-right truncate">
                Ch. {chapterIndex}/{chapterCount} · {section.title}
              </div>
            )}
          </div>

          {track && newChapter && section && (
            <div className="slab-inset p-4 mb-6 animate-rise">
              <div className="text-xs font-mono uppercase tracking-[0.14em] text-signal mb-1">
                Chapter {chapterIndex}: {section.title}
              </div>
              <p className="text-sm text-ink-2 leading-relaxed">{section.intro}</p>
            </div>
          )}

          <div key={q.id} className="animate-rise">
            <h1
              ref={titleRef}
              id="q-title"
              tabIndex={-1}
              className="display text-[1.75rem] leading-[1.1] sm:text-4xl outline-none"
            >
              {q.prompt}
            </h1>
            {q.help && (
              <p className="mt-3 text-[0.95rem] text-ink-2 leading-relaxed">
                <span className="text-ink-3">Why we ask — </span>
                {q.help}
              </p>
            )}
            {q.type === "multi" && (
              <p className="mt-2 text-xs font-mono uppercase tracking-[0.12em] text-ink-3">
                Select all that apply{q.maxSelect ? ` (up to ${q.maxSelect})` : ""}
              </p>
            )}

            <div
              className={`mt-6 ${isGoal ? "grid gap-3 sm:grid-cols-2" : "flex flex-col gap-2.5"}`}
              role="group"
              aria-labelledby="q-title"
            >
              {q.options.map((o, i) => {
                const selected = Array.isArray(value) ? value.includes(o.value) : value === o.value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    className={`option ${isGoal ? "!p-5 !rounded-[22px] flex-col !gap-2" : ""}`}
                    data-selected={selected ? "true" : "false"}
                    data-multi={q.type === "multi" ? "true" : "false"}
                    aria-pressed={selected}
                    onClick={() => select(q, o.value)}
                  >
                    {!isGoal && <span className="option-dot" aria-hidden="true" />}
                    <span className="flex-1 min-w-0">
                      <span className={`block ${isGoal ? "text-lg font-semibold" : "text-[0.98rem]"} leading-snug`}>
                        {o.label}
                      </span>
                      {o.detail && <span className="block mt-1 text-sm text-ink-3 leading-snug">{o.detail}</span>}
                    </span>
                    {!isGoal && (
                      <span className="hidden sm:block text-[0.65rem] font-mono text-ink-4 mt-1" aria-hidden="true">
                        {i + 1}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <p role="alert" className="mt-4 text-sm text-alert">
              {error}
            </p>
          )}

          <div className="mt-7 flex items-center justify-between gap-3">
            <button
              type="button"
              className="btn btn-quiet btn-sm"
              onClick={goBack}
              disabled={index === 0}
              aria-disabled={index === 0}
            >
              ← Back
            </button>
            {track && (q.type === "multi" || isLast) && (
              <button
                type="button"
                className={`btn ${isLast ? "btn-primary" : "btn-ghost"}`}
                disabled={!answered}
                onClick={() => (isLast ? void submit() : goNext())}
              >
                {isLast ? "See my diagnosis →" : "Continue →"}
              </button>
            )}
            {track && q.type === "single" && !isLast && answered && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={goNext}>
                Next →
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-ink-3">
        Your answers are saved on this device as you go. Keys 1–9 select, Enter continues.
      </p>
    </div>
  );
}
