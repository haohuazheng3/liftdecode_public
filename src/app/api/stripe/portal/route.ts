import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUser } from "@/lib/users";
import { stripe } from "@/lib/stripe";
import { APP_URL } from "@/lib/env";
import { captureFromUnknown } from "@/lib/errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Opens the Stripe customer portal (cancel / update card / invoices). */
export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "sign_in_required" }, { status: 401 });
    const user = await getUser(userId);
    if (!user?.stripeCustomerId) {
      return NextResponse.json({ error: "No billing history yet." }, { status: 404 });
    }
    const session = await stripe().billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${APP_URL}/account`,
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    await captureFromUnknown(e, "/api/stripe/portal");
    return NextResponse.json({ error: "Could not open billing. Please try again or contact us." }, { status: 500 });
  }
}
