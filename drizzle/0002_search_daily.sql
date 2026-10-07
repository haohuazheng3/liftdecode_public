CREATE TABLE "search_daily" (
	"id" serial PRIMARY KEY NOT NULL,
	"day" date NOT NULL,
	"page" text NOT NULL,
	"clicks" integer NOT NULL,
	"impressions" integer NOT NULL,
	"ctr" numeric(8, 5) NOT NULL,
	"position" numeric(8, 3) NOT NULL,
	"fetched_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "search_daily_unique" ON "search_daily" USING btree ("day","page");