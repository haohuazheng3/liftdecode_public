CREATE TABLE "assessments" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"anon_token" text NOT NULL,
	"track" text NOT NULL,
	"answers" jsonb NOT NULL,
	"result" jsonb NOT NULL,
	"engine_version" text NOT NULL,
	"duration_seconds" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"claimed_at" timestamp with time zone,
	"unlocked_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "backups" (
	"id" serial PRIMARY KEY NOT NULL,
	"object_key" text NOT NULL,
	"bytes" integer NOT NULL,
	"tables" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"message" text NOT NULL,
	"ip" text,
	"user_agent" text,
	"status" text DEFAULT 'new' NOT NULL,
	"notified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "entitlements" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"kind" text NOT NULL,
	"assessment_id" text,
	"stripe_checkout_session_id" text,
	"stripe_subscription_id" text,
	"stripe_customer_id" text,
	"status" text NOT NULL,
	"current_period_end" timestamp with time zone,
	"cancel_at_period_end" boolean DEFAULT false NOT NULL,
	"source" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "error_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"fingerprint" text NOT NULL,
	"name" text NOT NULL,
	"message" text NOT NULL,
	"stack" text,
	"route" text,
	"side" text NOT NULL,
	"severity" text DEFAULT 'error' NOT NULL,
	"count" integer DEFAULT 1 NOT NULL,
	"meta" jsonb,
	"first_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "inbox_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"to_addr" text NOT NULL,
	"from_addr" text NOT NULL,
	"subject" text,
	"text_body" text,
	"html_body" text,
	"headers" jsonb,
	"raw_size" integer,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"kind" text NOT NULL,
	"assessment_id" text,
	"stripe_checkout_session_id" text NOT NULL,
	"stripe_payment_intent_id" text,
	"stripe_subscription_id" text,
	"stripe_invoice_id" text,
	"amount_total" integer NOT NULL,
	"currency" text NOT NULL,
	"status" text NOT NULL,
	"promo_code" text,
	"customer_email" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"refunded_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "plan_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"assessment_id" text NOT NULL,
	"step_key" text NOT NULL,
	"done_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rate_limits" (
	"key" text PRIMARY KEY NOT NULL,
	"count" integer NOT NULL,
	"window_start" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "search_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"day" date NOT NULL,
	"query" text NOT NULL,
	"page" text NOT NULL,
	"clicks" integer NOT NULL,
	"impressions" integer NOT NULL,
	"ctr" numeric(8, 5) NOT NULL,
	"position" numeric(8, 3) NOT NULL,
	"fetched_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stripe_events" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	"processed_at" timestamp with time zone,
	"error" text
);
--> statement-breakpoint
CREATE TABLE "tracker_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"logged_on" date NOT NULL,
	"metric" text NOT NULL,
	"value" numeric(10, 2) NOT NULL,
	"unit" text NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"stripe_customer_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entitlements" ADD CONSTRAINT "entitlements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entitlements" ADD CONSTRAINT "entitlements_assessment_id_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_progress" ADD CONSTRAINT "plan_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_progress" ADD CONSTRAINT "plan_progress_assessment_id_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tracker_entries" ADD CONSTRAINT "tracker_entries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "assessments_user_idx" ON "assessments" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "assessments_anon_token_idx" ON "assessments" USING btree ("anon_token");--> statement-breakpoint
CREATE INDEX "entitlements_user_idx" ON "entitlements" USING btree ("user_id","kind","status");--> statement-breakpoint
CREATE UNIQUE INDEX "entitlements_subscription_idx" ON "entitlements" USING btree ("stripe_subscription_id");--> statement-breakpoint
CREATE UNIQUE INDEX "entitlements_report_session_idx" ON "entitlements" USING btree ("stripe_checkout_session_id","kind");--> statement-breakpoint
CREATE UNIQUE INDEX "error_fingerprint_idx" ON "error_events" USING btree ("fingerprint");--> statement-breakpoint
CREATE INDEX "error_last_seen_idx" ON "error_events" USING btree ("last_seen_at");--> statement-breakpoint
CREATE INDEX "inbox_to_idx" ON "inbox_messages" USING btree ("to_addr","received_at");--> statement-breakpoint
CREATE UNIQUE INDEX "orders_session_idx" ON "orders" USING btree ("stripe_checkout_session_id");--> statement-breakpoint
CREATE INDEX "orders_user_idx" ON "orders" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "plan_progress_unique" ON "plan_progress" USING btree ("user_id","assessment_id","step_key");--> statement-breakpoint
CREATE UNIQUE INDEX "search_analytics_unique" ON "search_analytics" USING btree ("day","query","page");--> statement-breakpoint
CREATE INDEX "tracker_user_metric_idx" ON "tracker_entries" USING btree ("user_id","metric","logged_on");--> statement-breakpoint
CREATE UNIQUE INDEX "tracker_unique_day" ON "tracker_entries" USING btree ("user_id","metric","logged_on");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_stripe_customer_idx" ON "users" USING btree ("stripe_customer_id");