import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getAssessment, resolveOwnership } from "@/lib/assessments";
import { canViewReport } from "@/lib/entitlements";
import { ResultPaywall } from "@/components/paywall/ResultPaywall";

export const metadata: Metadata = { title: "Your diagnosis is ready", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function ResultPage(props: PageProps<"/diagnose/result/[id]">) {
  const { id } = await props.params;
  const sp = await props.searchParams;
  const a = await getAssessment(id);
  if (!a) notFound();

  const { userId } = await auth();
  const { owns } = await resolveOwnership(a, userId);
  if (!owns) notFound();

  if (userId) {
    const access = await canViewReport(userId, id);
    if (access.allowed) redirect(`/report/${id}`);
  }

  // set by the paywall when a signed-out visitor picks a plan; sign-in brings them back here with it
  const intent = sp.intent === "report" || sp.intent === "membership" ? sp.intent : undefined;
  const canceled = sp.canceled === "1";

  return (
    <ResultPaywall
      id={id}
      track={a.track === "strength" ? "strength" : "physique"}
      answers={a.answers}
      result={a.result}
      signedIn={Boolean(userId)}
      canceled={canceled}
      intent={canceled ? undefined : intent}
    />
  );
}
