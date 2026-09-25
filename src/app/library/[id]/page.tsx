import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { FINDINGS } from "@/content/findings";
import { activeMembership } from "@/lib/entitlements";
import { CATEGORY_LABEL } from "@/lib/report/labels";
import { FindingBody } from "@/components/report/FindingBody";
import { MembershipUpsell } from "@/components/dashboard/MembershipUpsell";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: PageProps<"/library/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const f = FINDINGS[id];
  return { title: f ? `${f.title} — fix protocol` : "Fix protocol", robots: { index: false, follow: false } };
}

export default async function LibraryEntry(props: PageProps<"/library/[id]">) {
  const { id } = await props.params;
  const f = FINDINGS[id];
  if (!f) notFound();
  const { userId } = await auth();
  if (!userId) redirect(`/sign-in?redirect_url=${encodeURIComponent(`/library/${id}`)}`);
  const member = await activeMembership(userId);

  const related = (f.relatedFindings ?? []).map((r) => FINDINGS[r]).filter(Boolean);

  return (
    <div className="px-3 sm:px-5 py-6 sm:py-10">
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="eyebrow">
          <Link href="/library" className="hover:text-ink">
            Fix library
          </Link>{" "}
          / {CATEGORY_LABEL[f.category]}
        </div>
        <article className="slab p-6 sm:p-10 animate-rise">
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="tag">{CATEGORY_LABEL[f.category]}</span>
            <span className="tag">{f.audience === "both" ? "Both tracks" : `${f.audience} track`}</span>
          </div>
          <h1 className="display text-3xl sm:text-5xl">{f.title}</h1>
          <p className="mt-4 text-lg sm:text-xl text-ink leading-relaxed">{f.verdict}</p>
          <p className="mt-4 text-ink-2 leading-relaxed">{f.summary}</p>
          {member ? (
            <FindingBody content={f} />
          ) : (
            <div className="mt-8">
              <MembershipUpsell
                title="The protocol is for members."
                text="Unlocking a report gives you the protocols your answers point to. Membership opens all of them, plus the tracker, comparison and unlimited re-diagnoses."
              />
            </div>
          )}
        </article>
        {member && related.length > 0 && (
          <div className="slab p-5 sm:p-6">
            <div className="eyebrow mb-3">Often appears with</div>
            <ul className="grid gap-2 sm:grid-cols-2">
              {related.map((r) => (
                <li key={r.id}>
                  <Link href={`/library/${r.id}`} className="slab-inset block p-4 hover:border-line-2 transition-colors">
                    <div className="font-semibold text-ink">{r.title}</div>
                    <div className="mt-1 text-sm text-ink-3 leading-snug">{r.verdict}</div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
