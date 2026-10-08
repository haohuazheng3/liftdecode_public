import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { toImage, toStringArray as toList, type ContentImage } from "@/lib/content";

/**
 * Blog content layer.
 *
 * Posts are MDX files at `content/blog/<category>/<slug>.mdx` with frontmatter
 * `{ title, description, publishedAt, updatedAt?, draft?, tags? }`. Everything here
 * reads from disk synchronously at build time, so the blog pages stay fully static.
 *
 * Drafts render everywhere except production (Vercel production deployments, or a
 * plain `NODE_ENV=production` build outside Vercel) so a post can be QA'd on a
 * preview URL before it goes live.
 */

export type Category = {
  slug: string;
  /** Short label for navigation, cards and breadcrumbs. */
  title: string;
  /** The hub's H1 and <title>: carries the hub's own validated keyword. */
  h1: string;
  keyword: string;
  description: string;
  /** One-paragraph summary shown on paginated pages and cards; page 1 renders content/hubs/<slug>.md. */
  intro: string;
};

export type Post = {
  slug: string;
  category: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  draft: boolean;
  tags: string[];
  keyword: string;
  image: ContentImage | null;
  related: string[];
  content: string;
  /** search-intent level: "A" = tool-first page, "B" = decision page; absent = legacy article */
  level: "A" | "B" | null;
  /** A level: id of the first-screen tool (src/components/tools/registry.tsx) */
  tool: string;
  /** B level: the short answer shown in the conclusion card */
  verdict: string;
  /** A level: one line beside the hero button */
  heroLine: string;
};

export type PostPage = {
  posts: Post[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

export const CATEGORIES: Category[] = [
  {
    slug: "plateaus",
    title: "Plateaus",
    h1: "Workout Plateau: Why Progress Stops and What to Fix First",
    keyword: "workout plateau",
    description:
      "Why a workout plateau happens, how to tell a real stall from a bad month, and which variable to change first so the bar and the mirror start moving again.",
    intro:
      "A plateau is information, not a verdict. Almost every stall traces back to one or two things that stopped scaling, and the fix is rarely the thing you tried first.",
  },
  {
    slug: "programming",
    title: "Training",
    h1: "Hypertrophy Training: Sets, Reps, Rest and Progression",
    keyword: "hypertrophy training",
    description:
      "Hypertrophy training explained with numbers: weekly sets, rep ranges, rest, effort and progression, plus the training myths that quietly stall muscle growth.",
    intro:
      "Most people do not need a new programme. They need to know which training variable stopped working and how far to turn it.",
  },
  {
    slug: "programs",
    title: "Programs & splits",
    h1: "Workout Splits and Programs: Which One, and When It Stalls",
    keyword: "workout splits",
    description:
      "Workout splits and classic programs compared: how PPL, upper/lower, bro splits, 5x5, 5/3/1 and GZCLP are built, who each suits, and where each one stalls.",
    intro:
      "Every program works until it doesn't. What matters is knowing how yours progresses, where it runs out, and what to run next.",
  },
  {
    slug: "form",
    title: "Exercise form",
    h1: "Exercise Form: Technique Fixes for the Big Lifts",
    keyword: "exercise form",
    description:
      "Exercise form guides for the lifts that matter: setup, step-by-step technique and the form mistakes that cap your squat, bench, deadlift, press and rows.",
    intro:
      "Technique is a strength limiter long before it is a safety issue. These guides show what good form looks like and which mistakes stall each lift.",
  },
  {
    slug: "strength",
    title: "Strength standards",
    h1: "Strength Standards: How Strong Are You, Really?",
    keyword: "strength standards",
    description:
      "Strength standards and averages for the bench press, squat, deadlift and pull-ups, with the data behind every number and what to do when your lifts stall.",
    intro:
      "Numbers are only useful if you know who they describe. Every standard here says where it comes from, and what to do if you are stuck below it.",
  },
  {
    slug: "nutrition",
    title: "Nutrition",
    h1: "Diet for Muscle Gain: Calories, Protein and What Matters",
    keyword: "diet for muscle gain",
    description:
      "A diet for muscle gain that holds up to the evidence: calorie surplus, protein targets, bulking without getting fat, and the eating mistakes that stall lifters.",
    intro:
      "Training creates the demand; food decides whether your body can pay for it. These articles cover the fundamentals that actually move results.",
  },
  {
    slug: "recovery",
    title: "Recovery",
    h1: "Muscle Recovery: How Long It Takes and When It Limits Growth",
    keyword: "how long does muscle recovery take",
    description:
      "How long muscle recovery takes, how many rest days you need, when to deload, and how to tell normal soreness and fatigue from real under-recovery.",
    intro:
      "You do not grow in the gym; you grow recovering from it. Recovery is the lever people check last and should check first.",
  },
  {
    slug: "physique",
    title: "Building muscle",
    h1: "How to Gain Muscle When It's Stopped Coming Easy",
    keyword: "how to gain muscle",
    description:
      "How to gain muscle after the easy first year: realistic rates of gain, lagging body parts, skinny-fat and hardgainer fixes, and training after 40 and 50.",
    intro:
      "Muscle comes quickly at first and slowly after that. These guides are for the slow part: what still works, and what to fix when it stops.",
  },
];

const CATEGORY_SLUGS = new Set(CATEGORIES.map((c) => c.slug));
const CONTENT_DIR = path.join(process.cwd(), "content", "blog");
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
/** Reserved because `/blog/<category>/page/<n>` is a route. */
const RESERVED_SLUGS = new Set(["page"]);

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

/** Drafts are hidden only in real production. */
export function isProduction(): boolean {
  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv) return vercelEnv === "production";
  return process.env.NODE_ENV === "production";
}

function toDateString(v: unknown): string | null {
  if (v instanceof Date && !Number.isNaN(v.getTime())) return v.toISOString().slice(0, 10);
  if (typeof v === "string" && DATE_RE.test(v)) return v;
  return null;
}

function toStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((t): t is string => typeof t === "string" && t.trim().length > 0).map((t) => t.trim());
}

function parsePost(category: string, file: string): Post | null {
  const slug = file.replace(/\.mdx?$/, "");
  if (!SLUG_RE.test(slug) || RESERVED_SLUGS.has(slug)) return null;
  const raw = fs.readFileSync(path.join(CONTENT_DIR, category, file), "utf8");
  const { data, content } = matter(raw);
  const title = typeof data.title === "string" ? data.title.trim() : "";
  const description = typeof data.description === "string" ? data.description.trim() : "";
  const publishedAt = toDateString(data.publishedAt);
  if (!title || !description || !publishedAt) return null;
  const updatedAt = toDateString(data.updatedAt) ?? publishedAt;
  return {
    slug,
    category,
    title,
    description,
    publishedAt,
    updatedAt: updatedAt < publishedAt ? publishedAt : updatedAt,
    draft: data.draft === true,
    tags: toStringArray(data.tags),
    keyword: typeof data.keyword === "string" ? data.keyword.trim() : "",
    image: toImage(data.image),
    related: toList(data.related).filter((u) => u.startsWith("/")),
    content,
    level: data.level === "A" || data.level === "B" ? data.level : null,
    tool: typeof data.tool === "string" ? data.tool.trim() : "",
    verdict: typeof data.verdict === "string" ? data.verdict.trim() : "",
    heroLine: typeof data.heroLine === "string" ? data.heroLine.trim() : "",
  };
}

let cache: Post[] | null = null;

function loadAll(): Post[] {
  if (cache) return cache;
  const posts: Post[] = [];
  if (fs.existsSync(CONTENT_DIR)) {
    for (const category of CATEGORIES.map((c) => c.slug)) {
      const dir = path.join(CONTENT_DIR, category);
      if (!fs.existsSync(dir)) continue;
      for (const file of fs.readdirSync(dir)) {
        if (!file.endsWith(".mdx") && !file.endsWith(".md")) continue;
        const post = parsePost(category, file);
        if (post) posts.push(post);
      }
    }
  }
  // Newest first by last update, then publish date; slug only breaks exact ties (it used to decide almost everything,
  // because most posts share a publish date).
  posts.sort(
    (a, b) =>
      b.updatedAt.localeCompare(a.updatedAt) || b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug),
  );
  // Cache only in production builds; in dev, re-read so new files show up without a restart.
  if (process.env.NODE_ENV === "production") cache = posts;
  return posts;
}

/** All visible posts, most recently updated first. Drafts are excluded in production. */
export function getAllPosts(): Post[] {
  const hideDrafts = isProduction();
  return loadAll().filter((p) => !(hideDrafts && p.draft));
}

export function getPostsByCategory(slug: string, page = 1, perPage = 12): PostPage {
  const all = CATEGORY_SLUGS.has(slug) ? getAllPosts().filter((p) => p.category === slug) : [];
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, Math.floor(page)), totalPages);
  const start = (safePage - 1) * perPage;
  return { posts: all.slice(start, start + perPage), page: safePage, perPage, total, totalPages };
}

export function getPost(category: string, slug: string): Post | undefined {
  return getAllPosts().find((p) => p.category === category && p.slug === slug);
}

/** Rough reading time in whole minutes (min 1) at ~215 words per minute. */
export function readingTime(text: string): number {
  const plain = text
    .replace(/^---[\s\S]*?---\s*/, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`~\[\]()|-]/g, " ");
  const words = plain.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 215));
}

/** "September 25, 2026" — formatted in UTC so YYYY-MM-DD never shifts a day. */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );
}
