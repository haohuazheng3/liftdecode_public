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
  statementSuffix: "LIFTDECODE", // final descriptor: FUTURE TREE* LIFTDECODE
  icon: undefined as string | undefined,
  color: "#f5b544",
  /**
   * The Stripe account serves several brands, so its Public business name
   * ("Future Tree") is what Stripe puts in the browser tab title, the
   * authorisation sentence under the pay button and the card statement —
   * no session-level parameter can change those. Rather than let a buyer meet
   * an unfamiliar name at the moment of payment, we say who we are first.
   */
  operatorNote:
    "LiftDecode is operated by Future Tree. Your card statement will show FUTURE TREE* LIFTDECODE.",
} as const;

export const PRICES = {
  membership: () => process.env.STRIPE_PRICE_MEMBERSHIP ?? "",
  report: () => process.env.STRIPE_PRICE_REPORT ?? "",
};

export type PurchaseKind = "membership" | "report";
