import type { FindingContent, Track } from "@/content/types";
import { TRACK_LABEL } from "@/lib/report/labels";

/** The evergreen part of a finding (everything except "what you told us"). */
export function FindingBody({ content, track, showPlan = true }: { content: FindingContent; track?: Track; showPlan?: boolean }) {
  const note = track ? content.trackNotes?.[track] : null;
  return (
    <>
      <div className="prose-ld mt-8">
        <h3>Why this stalls you</h3>
        {content.mechanism.map((p, i) => (
          <p key={i}>{p}</p>
        ))}

        <h3>How it shows up</h3>
        <ul>
          {content.howItShowsUp.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <div className="eyebrow mb-3">The fix</div>
        <div className="space-y-4">
          {content.fix.map((block, bi) => (
            <div key={bi} className="slab-inset p-5">
              <h4 className="font-semibold text-ink mb-3">{block.title}</h4>
              <ol className="space-y-2.5">
                {block.steps.map((s, si) => (
                  <li key={si} className="flex gap-3 text-[0.95rem] text-ink-2 leading-relaxed">
                    <span className="grid place-items-center w-6 h-6 shrink-0 rounded-full bg-signal/15 text-signal text-xs font-mono">
                      {si + 1}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>

      {note && track && (
        <div className="mt-6 border-l-2 border-signal/60 pl-4">
          <div className="eyebrow mb-1">For the {TRACK_LABEL[track].toLowerCase()} track</div>
          <p className="text-ink-2 leading-relaxed">{note}</p>
        </div>
      )}
      {!track && content.trackNotes && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {content.trackNotes.physique && (
            <div className="border-l-2 border-signal/60 pl-4">
              <div className="eyebrow mb-1">Physique track</div>
              <p className="text-ink-2 leading-relaxed text-sm">{content.trackNotes.physique}</p>
            </div>
          )}
          {content.trackNotes.strength && (
            <div className="border-l-2 border-signal/60 pl-4">
              <div className="eyebrow mb-1">Strength track</div>
              <p className="text-ink-2 leading-relaxed text-sm">{content.trackNotes.strength}</p>
            </div>
          )}
        </div>
      )}

      {showPlan && (
      <div className="mt-8">
        <div className="eyebrow mb-3">Four weeks, in order</div>
        <ol className="grid gap-2 sm:grid-cols-2">
          {content.fourWeekPlan.map((w, i) => (
            <li key={i} className="slab-inset p-4 text-sm text-ink-2 leading-relaxed">
              <span className="block font-mono text-[11px] uppercase tracking-[0.12em] text-signal mb-1">Week {i + 1}</span>
              {w}
            </li>
          ))}
        </ol>
      </div>
      )}

      <div className="prose-ld mt-8">
        <h3>What to expect</h3>
        <p>{content.timeline}</p>
        <h3>Don&rsquo;t reach for</h3>
        <ul>
          {content.mistakes.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
