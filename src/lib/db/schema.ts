import {
  pgTable,
  text,
  timestamp,
  jsonb,
  integer,
  boolean,
  index,
  uniqueIndex,
  serial,
  date,
  numeric,
} from "drizzle-orm/pg-core";
import type { DiagnosisResult } from "../engine/types";

export type Answers = Record<string, string | string[]>;

/** Mirrors Clerk users; created on first sign-in (webhook + lazy upsert). */
export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(), // Clerk user id
    email: text("email").notNull(),
    stripeCustomerId: text("stripe_customer_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
  },
  (t) => [uniqueIndex("users_email_idx").on(t.email), index("users_stripe_customer_idx").on(t.stripeCustomerId)],
);

/** One completed diagnostic. Anonymous until claimed by a signed-in user. */
export const assessments = pgTable(
  "assessments",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    /** secret token held in a cookie so an anonymous visitor can come back to their preview */
    anonToken: text("anon_token").notNull(),
    track: text("track").notNull(), // physique | strength
    answers: jsonb("answers").$type<Answers>().notNull(),
    result: jsonb("result").$type<DiagnosisResult>().notNull(),
    engineVersion: text("engine_version").notNull(),
    /** seconds spent answering, reported by the client */
    durationSeconds: integer("duration_seconds"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    claimedAt: timestamp("claimed_at", { withTimezone: true }),
    /** set when a report unlock or membership first grants access */
    unlockedAt: timestamp("unlocked_at", { withTimezone: true }),
  },
  (t) => [
    index("assessments_user_idx").on(t.userId, t.createdAt),
    uniqueIndex("assessments_anon_token_idx").on(t.anonToken),
  ],
);

/** What a user is allowed to see. Written by checkout verification, webhook, or reconcile. */
export const entitlements = pgTable(
  "entitlements",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(), // report | membership
    /** for kind=report */
    assessmentId: text("assessment_id").references(() => assessments.id, { onDelete: "set null" }),
    stripeCheckoutSessionId: text("stripe_checkout_session_id"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    stripeCustomerId: text("stripe_customer_id"),
    status: text("status").notNull(), // active | past_due | canceled | refunded
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),
    source: text("source").notNull(), // checkout_verify | webhook | reconcile | admin
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("entitlements_user_idx").on(t.userId, t.kind, t.status),
    uniqueIndex("entitlements_subscription_idx").on(t.stripeSubscriptionId),
    uniqueIndex("entitlements_report_session_idx").on(t.stripeCheckoutSessionId, t.kind),
  ],
);

/** Every paid Checkout Session, for the admin ledger and reconciliation. */
export const orders = pgTable(
  "orders",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    kind: text("kind").notNull(), // report | membership
    assessmentId: text("assessment_id"),
    stripeCheckoutSessionId: text("stripe_checkout_session_id").notNull(),
    stripePaymentIntentId: text("stripe_payment_intent_id"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    stripeInvoiceId: text("stripe_invoice_id"),
    amountTotal: integer("amount_total").notNull(), // cents
    currency: text("currency").notNull(),
    status: text("status").notNull(), // paid | refunded | failed | pending
    promoCode: text("promo_code"),
    customerEmail: text("customer_email"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    refundedAt: timestamp("refunded_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("orders_session_idx").on(t.stripeCheckoutSessionId),
    index("orders_user_idx").on(t.userId, t.createdAt),
  ],
);

/** Idempotency ledger for Stripe webhook events. */
export const stripeEvents = pgTable("stripe_events", {
  id: text("id").primaryKey(), // evt_…
  type: text("type").notNull(),
  receivedAt: timestamp("received_at", { withTimezone: true }).defaultNow().notNull(),
  processedAt: timestamp("processed_at", { withTimezone: true }),
  error: text("error"),
});

/** Check-offs on the 4-week action plan. */
export const planProgress = pgTable(
  "plan_progress",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    assessmentId: text("assessment_id")
      .notNull()
      .references(() => assessments.id, { onDelete: "cascade" }),
    stepKey: text("step_key").notNull(), // `${findingId}:w${week}` or `${findingId}:fix${i}:${j}`
    doneAt: timestamp("done_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [uniqueIndex("plan_progress_unique").on(t.userId, t.assessmentId, t.stepKey)],
);

/** Member plateau tracker: weekly numbers. */
export const trackerEntries = pgTable(
  "tracker_entries",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    loggedOn: date("logged_on").notNull(),
    metric: text("metric").notNull(), // squat | bench | deadlift | press | bodyweight | waist | arm | chest | thigh | custom:*
    value: numeric("value", { precision: 10, scale: 2 }).notNull(),
    unit: text("unit").notNull(), // kg | lb | cm | in
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("tracker_user_metric_idx").on(t.userId, t.metric, t.loggedOn),
    uniqueIndex("tracker_unique_day").on(t.userId, t.metric, t.loggedOn),
  ],
);

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  ip: text("ip"),
  userAgent: text("user_agent"),
  status: text("status").default("new").notNull(), // new | replied | spam
  notifiedAt: timestamp("notified_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/** Self-hosted error inbox. Grouped by fingerprint = name + first stack frame + route. */
export const errorEvents = pgTable(
  "error_events",
  {
    id: serial("id").primaryKey(),
    fingerprint: text("fingerprint").notNull(),
    name: text("name").notNull(),
    message: text("message").notNull(),
    stack: text("stack"),
    route: text("route"),
    side: text("side").notNull(), // server | client | edge
    severity: text("severity").default("error").notNull(), // error | warning
    count: integer("count").default(1).notNull(),
    meta: jsonb("meta").$type<Record<string, unknown>>(),
    firstSeenAt: timestamp("first_seen_at", { withTimezone: true }).defaultNow().notNull(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).defaultNow().notNull(),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  },
  (t) => [uniqueIndex("error_fingerprint_idx").on(t.fingerprint), index("error_last_seen_idx").on(t.lastSeenAt)],
);

/** Test inbox: mail to *@liftdecode.com routed through the Cloudflare Email Worker. */
export const inboxMessages = pgTable(
  "inbox_messages",
  {
    id: serial("id").primaryKey(),
    toAddr: text("to_addr").notNull(),
    fromAddr: text("from_addr").notNull(),
    subject: text("subject"),
    textBody: text("text_body"),
    htmlBody: text("html_body"),
    headers: jsonb("headers").$type<Record<string, string>>(),
    rawSize: integer("raw_size"),
    receivedAt: timestamp("received_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("inbox_to_idx").on(t.toAddr, t.receivedAt)],
);

/** Daily Google Search Console pull. */
export const searchAnalytics = pgTable(
  "search_analytics",
  {
    id: serial("id").primaryKey(),
    day: date("day").notNull(),
    query: text("query").notNull(),
    page: text("page").notNull(),
    clicks: integer("clicks").notNull(),
    impressions: integer("impressions").notNull(),
    ctr: numeric("ctr", { precision: 8, scale: 5 }).notNull(),
    position: numeric("position", { precision: 8, scale: 3 }).notNull(),
    fetchedAt: timestamp("fetched_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [uniqueIndex("search_analytics_unique").on(t.day, t.query, t.page)],
);

/** Fixed-window rate limiter keyed by route + ip (serverless-safe). */
export const rateLimits = pgTable("rate_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull(),
  windowStart: timestamp("window_start", { withTimezone: true }).notNull(),
});

/** Backup log for the nightly export to R2. */
export const backups = pgTable("backups", {
  id: serial("id").primaryKey(),
  objectKey: text("object_key").notNull(),
  bytes: integer("bytes").notNull(),
  tables: jsonb("tables").$type<Record<string, number>>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
