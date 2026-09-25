import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import type { FindingCategory } from "@/content/types";
import { FINDING_LIST } from "@/content/findings";
import { activeMembership } from "@/lib/entitlements";
import { CATEGORY_LABEL } from "@/lib/report/labels";
import { MembershipUpsell } from "@/components/dashboard/MembershipUpsell";

export const metadata: Metadata = {
  title: "Fix library",
  description: "Every bottleneck LiftDecode diagnoses, with the full protocol to fix it. Members read all of it.",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const ORDER: FindingCategory[] = [
  "progression",
  "effort",
  "volume",
  "programming",
  "technique",
  "nutrition",
  "recovery",
  "consistency",
  "measurement",
  "expectations",
  "lifestyle",
];

export default async function LibraryPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=/library");
  const member = await activeMembership(userId);

  const groups = ORDER.map((cat) => ({
    cat,
    items: FINDING_LIST.filter((f) => f.category === cat).sort((a, b) => a.title.localeCompare(b.title)),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="px-3 sm:px-5 py-6 sm:py-10">
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="slab p-6 sm:p-8 animate-rise">
          <div className="eyebrow mb-2">Fix library · {FINDING_LIST.length} protocols</div>
          <h1 className="display text-3xl sm:text-5xl">
            Every way a lifter <em>stalls</em>.
          </h1>
          <p className="mt-3 text-ink-2 leading-relaxed max-w-2xl">
            Each entry is a full protocol: why it stalls you, how it shows up, the fix, a four-week order of operations,
            and the mistakes people make instead. Your report picks the ones your answers point to; the library lets you
            read the rest.
          </p>
        </div>

        {!member && (
          <MembershipUpsell
            title="Members read every protocol."
            text="Without membership you can browse titles and verdicts here; the protocols themselves are inside the reports you unlock and in the full library for members."
          />
        )}

        {groups.map((g) => (
          <section key={g.cat} className="slab p-5 sm:p-6">
            <div className="eyebrow mb-3">{CATEGORY_LABEL[g.cat]}</div>
            <ul className="grid gap-2 sm:grid-cols-2">
              {g.items.map((f) => (
                <li key={f.id}>
                  {member ? (
                    <Link href={`/library/${f.id}`} className="slab-inset block p-4 hover:border-line-2 transition-colors">
                      <div className="font-semibold text-ink">{f.title}</div>
                      <div className="mt-1 text-sm text-ink-3 leading-snug">{f.verdict}</div>
                      <div className="mt-2 text-[11px] font-mono uppercase tracking-[0.1em] text-signal">
                        Read protocol →
                      </div>
                    </Link>
                  ) : (
                    <div className="slab-inset p-4">
                      <div className="font-semibold text-ink">{f.title}</div>
                      <div className="mt-1 text-sm text-ink-3 leading-snug">{f.verdict}</div>
                      <div className="mt-2 tag">Members only</div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
