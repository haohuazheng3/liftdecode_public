import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { activeMembership } from "@/lib/entitlements";
import { loadSeries } from "@/lib/tracker";
import { TrackerClient } from "./TrackerClient";
import { MembershipUpsell } from "@/components/dashboard/MembershipUpsell";

export const metadata: Metadata = { title: "Plateau tracker", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function TrackerPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=/dashboard/tracker");
  const member = await activeMembership(userId);

  return (
    <div className="px-3 sm:px-5 py-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <div className="eyebrow mb-1">
              <Link href="/dashboard" className="hover:text-ink">
                Dashboard
              </Link>{" "}
              / Tracker
            </div>
            <h1 className="display text-3xl sm:text-4xl">
              Numbers that <em>tell</em> on you.
            </h1>
          </div>
        </div>
        {member ? (
          <TrackerClient series={await loadSeries(userId)} />
        ) : (
          <MembershipUpsell
            title="The tracker is a membership feature."
            text="Log your top sets and one measurement a week; after three weeks it flags whatever stopped moving, so your next diagnosis starts from facts instead of feelings."
          />
        )}
      </div>
    </div>
  );
}
