import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { grantFromCheckoutSession } from "@/lib/entitlements";
import { captureFromUnknown } from "@/lib/errors";

export const metadata: Metadata = { title: "Confirming your payment", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/**
 * Primary unlock path: we do not wait for the webhook. The session is verified
 * with Stripe server-side and the entitlement is written right here.
 */
export default async function CheckoutSuccess(props: PageProps<"/checkout/success">) {
  const sp = await props.searchParams;
  const sessionId = typeof sp.session_id === "string" ? sp.session_id : "";
  const { userId } = await auth();
  if (!userId) redirect(`/sign-in?redirect_url=${encodeURIComponent(`/checkout/success?session_id=${sessionId}`)}`);
  if (!sessionId.startsWith("cs_")) redirect("/pricing");

  let outcome: "granted" | "pending" | "mismatch" | "error" = "error";
  let target = "/dashboard";
  try {
    const session = await stripe().checkout.sessions.retrieve(sessionId, { expand: ["subscription", "payment_intent"] });
    const owner = session.metadata?.userId ?? session.client_reference_id;
    if (owner !== userId) {
      outcome = "mismatch";
    } else if (session.payment_status === "paid" || session.payment_status === "no_payment_required") {
      const r = await grantFromCheckoutSession(session, "checkout_verify");
      if (r.ok) {
        outcome = "granted";
        target = r.assessmentId ? `/report/${r.assessmentId}?unlocked=1` : "/dashboard?welcome=member";
      }
    } else {
      outcome = "pending";
    }
  } catch (e) {
    await captureFromUnknown(e, "/checkout/success", "server", { sessionId });
    outcome = "error";
  }

  if (outcome === "granted") redirect(target);

  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-lg slab p-8 animate-rise">
        {outcome === "pending" && (
          <>
            <div className="eyebrow mb-3">Payment processing</div>
            <h1 className="display text-3xl">Your bank is still confirming.</h1>
            <p className="mt-3 text-ink-2">
              Some payment methods take a minute. Your report unlocks automatically the moment Stripe confirms — refresh
              this page, or check your dashboard.
            </p>
            <div className="mt-6 flex gap-3">
              <a href={`/checkout/success?session_id=${sessionId}`} className="btn btn-primary">
                Refresh
              </a>
              <Link href="/dashboard" className="btn btn-ghost">
                Dashboard
              </Link>
            </div>
          </>
        )}
        {outcome === "mismatch" && (
          <>
            <div className="eyebrow mb-3">Different account</div>
            <h1 className="display text-3xl">This purchase belongs to another sign-in.</h1>
            <p className="mt-3 text-ink-2">
              Sign in with the email you used at checkout. If you think this is wrong, contact us and we will sort it out.
            </p>
            <Link href="/contact" className="btn btn-ghost mt-6">
              Contact support
            </Link>
          </>
        )}
        {outcome === "error" && (
          <>
            <div className="eyebrow mb-3">One moment</div>
            <h1 className="display text-3xl">We could not confirm the payment yet.</h1>
            <p className="mt-3 text-ink-2">
              This has been logged. Refresh in a few seconds — if you were charged, your access will appear on your
              dashboard automatically.
            </p>
            <div className="mt-6 flex gap-3">
              <a href={`/checkout/success?session_id=${sessionId}`} className="btn btn-primary">
                Refresh
              </a>
              <Link href="/dashboard" className="btn btn-ghost">
                Dashboard
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
