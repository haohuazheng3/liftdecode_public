CREATE TABLE "ai_reports" (
	"assessment_id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"status" text NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"stage" integer DEFAULT 0 NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"model" text,
	"prompt_version" text NOT NULL,
	"output" jsonb,
	"input_tokens" integer,
	"output_tokens" integer,
	"cost_micros" integer,
	"error" text,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_reports" ADD CONSTRAINT "ai_reports_assessment_id_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_reports" ADD CONSTRAINT "ai_reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ai_reports_user_idx" ON "ai_reports" USING btree ("user_id","created_at");