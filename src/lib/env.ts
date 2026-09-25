/**
 * Environment variable registry. Names only — never log values.
 * `required` ones are reported by /api/health; the site degrades gracefully
 * when an optional one is missing.
 */
export const ENV_REQUIRED = [
  "DATABASE_URL",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PRICE_MEMBERSHIP",
  "STRIPE_PRICE_REPORT",
  "NEXT_PUBLIC_APP_URL",
] as const;

export const ENV_OPTIONAL = [
  "CLERK_WEBHOOK_SIGNING_SECRET",
  "NEXT_PUBLIC_FLOWGLANCE_SITE",
  "FLOWGLANCE_SITE_ID",
  "ADMIN_EMAILS",
  "INBOX_INGEST_SECRET",
  "EMAIL_WORKER_URL",
  "EMAIL_WORKER_SECRET",
  "CRON_SECRET",
  "ALERT_EMAIL",
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET",
  "ANTHROPIC_API_KEY",
  "GOOGLE_SERVICE_ACCOUNT_B64",
  "INDEXNOW_KEY",
] as const;

export function envPresence() {
  const required = Object.fromEntries(ENV_REQUIRED.map((k) => [k, Boolean(process.env[k])]));
  const optional = Object.fromEntries(ENV_OPTIONAL.map((k) => [k, Boolean(process.env[k])]));
  const missingRequired = ENV_REQUIRED.filter((k) => !process.env[k]);
  return { required, optional, missingRequired };
}

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://liftdecode.com";
export const BRAND = "LiftDecode";
export const CONTACT_EMAIL = "contact@liftdecode.com";

/** Comma-separated list in ADMIN_EMAILS. No default: with it unset, nobody is an admin. */
export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminEmails().includes(email.toLowerCase());
}
