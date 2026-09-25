import Stripe from "stripe";

let client: Stripe | null = null;

export function stripe(): Stripe {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
    client = new Stripe(key, { typescript: true });
  }
  return client;
}

export function stripeMode(): "live" | "test" | "missing" {
  const key = process.env.STRIPE_SECRET_KEY ?? "";
  if (!key) return "missing";
  return key.includes("_live_") ? "live" : "test";
}

/**
 * Brand settings are a server-side whitelist: the client never gets to choose
 * what name appears on the Checkout page or the card statement.
 */
export const CHECKOUT_BRAND = {
  displayName: "LiftDecode",
  statementSuffix: "LIFTDECODE", // final descriptor: <account prefix>* LIFTDECODE
  icon: undefined as string | undefined,
  color: "#f5b544",
} as const;

export const PRICES = {
  membership: () => process.env.STRIPE_PRICE_MEMBERSHIP ?? "",
  report: () => process.env.STRIPE_PRICE_REPORT ?? "",
};

export type PurchaseKind = "membership" | "report";
