import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { FINDINGS } from "@/content/findings";
import { listAssessments } from "@/lib/assessments";
import { activeMembership } from "@/lib/entitlements";
import { CATEGORY_LABEL, TRACK_LABEL } from "@/lib/report/labels";
import { MembershipUpsell } from "@/components/dashboard/MembershipUpsell";

export const metadata: Metadata = { title: "Compare reports", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

function fmt(d: Date | string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(d));
}

type Listed = Awaited<ReturnType<typeof listAssessments>>[number];

function Picker({ name, value, other, list }: { name: "a" | "b"; value: string; other: string; list: Listed[] }) {
  return (
    <form className="flex-1" action="/dashboard/compare" method="get">
      <input type="hidden" name={name === "a" ? "b" : "a"} value={other} />
      <label className="eyebrow block mb-1" htmlFor={`pick-${name}`}>
        {name === "a" ? "Before" : "After"}
      </label>
      <select id={`pick-${name}`} name={name} defaultValue={value} className="input">
        {list.map((x) => (
          <option key={x.id} value={x.id}>
            {fmt(x.createdAt)} · {TRACK_LABEL[x.track === "strength" ? "strength" : "physique"]} ·{" "}
            {x.result.primary ? FINDINGS[x.result.primary]?.title : "no bottleneck"}
          </option>
        ))}
      </select>
      <button type="submit" className="btn btn-quiet btn-sm mt-2">
        Apply
      </button>
    </form>
  );
}

function Row({ id, tone, note }: { id: string; tone: "clear" | "alert" | "signal"; note: string }) {
  const c = FINDINGS[id];
  if (!c) return null;
  return (
    <li className="slab-inset p-4">
      <div className="flex items-center gap-2 mb-1">
        <span className={`tag tag-${tone}`}>{note}</span>
        <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-ink-3">{CATEGORY_LABEL[c.category]}</span>
      </div>
      <div className="font-semibold text-ink">{c.title}</div>
    </li>
  );
}

export default async function ComparePage(props: PageProps<"/dashboard/compare">) {
  const sp = await props.searchParams;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=/dashboard/compare");
  const member = await activeMembership(userId);

  const shell = (children: React.ReactNode) => (
    <div className="px-3 sm:px-5 py-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5">
          <div className="eyebrow mb-1">
            <Link href="/dashboard" className="hover:text-ink">
              Dashboard
            </Link>{" "}
            / Compare
          </div>
          <h1 className="display text-3xl sm:text-4xl">
            What <em>changed</em>.
          </h1>
        </div>
        {children}
      </div>
    </div>
  );

  if (!member) {
    return shell(
      <MembershipUpsell
        title="Comparing reports is a membership feature."
        text="Re-run the diagnosis after four weeks and see which bottlenecks cleared, which persisted, and what new ones appeared as your training changed."
      />,
    );
  }

  const list = await listAssessments(userId);
  if (list.length < 2) {
    return shell(
      <div className="slab p-6 sm:p-8">
        <div className="eyebrow mb-2">Needs two reports</div>
        <p className="text-ink-2 leading-relaxed max-w-xl">
          You have {list.length} diagnosis so far. Run another after you have worked the plan for a few weeks, then come
          back here.
        </p>
        <Link href="/diagnose" className="btn btn-primary mt-5">
          Re-diagnose
        </Link>
      </div>,
    );
  }

  const aId = typeof sp.a === "string" ? sp.a : list[1].id; // older
  const bId = typeof sp.b === "string" ? sp.b : list[0].id; // newer
  const A = list.find((x) => x.id === aId) ?? list[1];
  const B = list.find((x) => x.id === bId) ?? list[0];

  const aF = new Map(A.result.findings.map((f) => [f.id, f]));
  const bF = new Map(B.result.findings.map((f) => [f.id, f]));
  const cleared = A.result.findings.filter((f) => !bF.has(f.id));
  const persisted = B.result.findings.filter((f) => aF.has(f.id));
  const appeared = B.result.findings.filter((f) => !aF.has(f.id));

  return shell(
    <div className="space-y-4">
      <div className="slab p-5 sm:p-6 flex flex-col sm:flex-row gap-4">
        <Picker name="a" value={A.id} other={B.id} list={list} />
        <Picker name="b" value={B.id} other={A.id} list={list} />
      </div>

      {A.track !== B.track && (
        <p className="text-sm text-ink-3">
          These two reports are on different tracks ({TRACK_LABEL[A.track === "strength" ? "strength" : "physique"]} vs{" "}
          {TRACK_LABEL[B.track === "strength" ? "strength" : "physique"]}); some findings only exist on one track.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="slab p-5">
          <div className="eyebrow mb-3">Cleared ({cleared.length})</div>
          {cleared.length ? (
            <ul className="space-y-2">
              {cleared.map((f) => (
                <Row key={f.id} id={f.id} tone="clear" note="Gone" />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-3">Nothing cleared yet.</p>
          )}
        </div>
        <div className="slab p-5">
          <div className="eyebrow mb-3">Still there ({persisted.length})</div>
          {persisted.length ? (
            <ul className="space-y-2">
              {persisted.map((f) => {
                const before = aF.get(f.id)!;
                const dir = f.score < before.score ? "Weaker" : f.score > before.score ? "Stronger" : "Same";
                return <Row key={f.id} id={f.id} tone={dir === "Weaker" ? "signal" : "alert"} note={dir} />;
              })}
            </ul>
          ) : (
            <p className="text-sm text-ink-3">No bottleneck persisted.</p>
          )}
        </div>
        <div className="slab p-5">
          <div className="eyebrow mb-3">New ({appeared.length})</div>
          {appeared.length ? (
            <ul className="space-y-2">
              {appeared.map((f) => (
                <Row key={f.id} id={f.id} tone="alert" note="New" />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-3">Nothing new appeared.</p>
          )}
        </div>
      </div>

      <div className="slab p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-ink-2 text-sm leading-relaxed">
          Before: {fmt(A.createdAt)} · {A.result.findings.length} findings. After: {fmt(B.createdAt)} ·{" "}
          {B.result.findings.length} findings.
        </p>
        <div className="flex gap-2">
          <Link href={`/report/${A.id}`} className="btn btn-quiet btn-sm">
            Open before
          </Link>
          <Link href={`/report/${B.id}`} className="btn btn-ghost btn-sm">
            Open after
          </Link>
        </div>
      </div>
    </div>,
  );
}
