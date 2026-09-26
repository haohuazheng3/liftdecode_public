# LiftDecode

**A diagnostic for lifters who stopped progressing.**

You answer a short, specific questionnaire about how you train, eat, sleep and recover. A rule-based engine scores the answers against a library of known plateau causes and returns a report: the bottlenecks that are most likely holding you back, the things that are *not* your problem, and a four-week plan built from the top findings. No wearables, no uploads, no guesswork dressed up as AI.

This repository is the source of the site at [liftdecode.com](https://liftdecode.com).

## How it works

1. **Quiz** — two tracks (physique or strength), chosen by the first question. Every question is one tap: mostly a 1–10 intensity scale, otherwise two to four short options. It asks about habits and how things feel, never for numbers or measurements, and it never shows its length or a progress bar.
2. **Engine** — `src/lib/engine/` turns the answers into a `DiagnosisResult`: scored *findings* (bottlenecks), *clearances* (ruled-out causes) and a primary finding. The result is stored with the assessment and never recomputed, so an old report stays the same report.
3. **Preview and unlock** — the result page shows what was found without the details. A membership or a single-report purchase unlocks the full report and the plan.
4. **Report** — findings with the reasoning behind them, what to change, and a week-by-week plan with check-offs.

Content lives in `src/content/`: the questions, the rules and one file per finding. The engine and the report are data-driven, so adding a finding is adding a file.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19, TypeScript) |
| Styling | Tailwind CSS v4, design tokens in `src/app/globals.css` |
| Auth | Clerk (email code sign-in) |
| Database | Neon Postgres via the serverless HTTP driver, Drizzle ORM |
| Payments | Stripe Checkout (subscription and one-time) |
| Analytics | FlowGlance |
| Mail | Cloudflare Email Routing + a small Worker (`infra/email-worker`) |
| Hosting | Vercel (site, API routes, cron jobs), Cloudflare R2 (backups) |

## Running locally

Requirements: Node 22 and npm.

```bash
git clone https://github.com/haohuazheng3/liftdecode_public.git
cd liftdecode_public
npm ci
cp .env.example .env.local   # fill in at least the "required" block
npm run db:migrate           # applies drizzle/ migrations to DATABASE_URL_UNPOOLED
npm run dev                  # http://localhost:3000
```

Every variable the app reads is listed with a one-line description in [`.env.example`](.env.example). The required block (database, Clerk, Stripe, app URL) is enough to run the full quiz → checkout → report flow against your own test accounts. Everything else is optional and the site degrades without it: no Search Console pull, no R2 backups, no mail inbox.

Useful scripts:

```bash
npm run typecheck        # tsc --noEmit
npm run lint             # eslint
npm run gen:findings     # regenerate src/content/findings/index.ts after adding a finding
npm run db:generate      # create a migration from schema changes
```

## Deploying

The site is designed for Vercel:

- Set the environment variables from `.env.example` in the project settings.
- `vercel.json` registers three cron jobs (`/api/cron/backup`, `/api/cron/reconcile`, `/api/cron/gsc`). Vercel sends `CRON_SECRET` as a bearer token automatically once the variable exists.
- The backup job writes `backups/<date>.json.gz` to R2 and deletes copies older than `BACKUP_RETENTION_DAYS` (30, in `src/lib/backup.ts`). The privacy policy quotes that window, so change both together.
- Point a Stripe webhook at `/api/stripe/webhook` and a Clerk webhook at `/api/clerk/webhook`; put their signing secrets in the environment.
- `/api/health` returns 200 when the database answers, the required variables are present and the error inbox is empty; use it for uptime monitoring.

The mail worker in `infra/email-worker` is a separate Cloudflare Worker with its own `package.json`; see the comments in its `wrangler.toml` for the secrets it needs.

## Project layout

```
src/app/            routes (App Router), API handlers under src/app/api
src/components/     UI: quiz, paywall, report, layout
src/content/        questions, rules, findings — the editable knowledge base
src/lib/            engine, db schema, entitlements, stripe, errors, rate limit
drizzle/            SQL migrations
infra/email-worker/ Cloudflare Email Worker (inbox + owner notifications)
scripts/            build-time helpers
```

## A note on scope

LiftDecode gives training and recovery guidance based on the answers you give. It is not medical advice and does not diagnose medical conditions. If something hurts, see a professional.

## License

Source is published for transparency and learning. The questionnaire content, the finding library and the LiftDecode name and brand are © LiftDecode and are not licensed for reuse. Code is covered by the `LICENSE` file when one is present in this checkout; otherwise all rights are reserved.
