import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

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
  title: string;
  description: string;
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
  content: string;
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
    title: "Breaking plateaus",
    description:
      "Why lifts stall, how to tell a real plateau from a bad month, and the specific levers that get the bar moving again.",
    intro:
      "A plateau is information, not a verdict. Almost every stall traces back to one or two things that stopped scaling — load, volume, recovery, food, or the way you measure progress — and the fix is rarely the thing you tried first. These articles show you how to read a stall the way a good coach would, so you change the right variable instead of all of them.",
  },
  {
    slug: "programming",
    title: "Programming",
    description:
      "Sets, reps, frequency, progression and deloads — how to structure training so it keeps producing results month after month.",
    intro:
      "Most people do not need a new programme. They need to understand why the one they have stopped working, and which dial to turn next. This section covers progression schemes, volume landmarks, exercise selection and deloads in plain language, with the trade-offs spelled out so you can make the call for your own training.",
  },
  {
    slug: "nutrition",
    title: "Nutrition",
    description:
      "Calories, protein, timing and the boring consistency that decides whether your training turns into muscle or strength.",
    intro:
      "Training creates the demand; food decides whether your body can pay for it. The nutrition articles here are about the fundamentals that actually move results — energy balance, protein, carbohydrate around training, and eating in a way you can sustain for a year rather than a fortnight. No supplement hype, no miracle protocols, just the parts that hold up.",
  },
  {
    slug: "recovery",
    title: "Recovery",
    description:
      "Sleep, stress, fatigue management and the difference between being tired and being under-recovered.",
    intro:
      "You do not get stronger in the gym; you get stronger recovering from it. When progress stalls, recovery is the lever people check last and should check first — sleep, stress load, how often you train close to failure, and whether a deload is overdue. These articles explain how to spot under-recovery early and what to change before it costs you weeks.",
  },
  {
    slug: "strength",
    title: "Strength",
    description:
      "Getting the squat, bench, deadlift and press moving again — technique, load management and peaking for lifters who chase numbers.",
    intro:
      "Strength is a skill, and stalls on the big lifts usually come from one of three places: technique that breaks under load, progression that outran your recovery, or too much time spent grinding near your max. The strength section covers how to diagnose which one it is and how to rebuild momentum without losing the base you have already built.",
  },
  {
    slug: "physique",
    title: "Physique",
    description:
      "Building muscle and changing how you look — hypertrophy training, body recomposition and measuring the changes you cannot see in the mirror.",
    intro:
      "Physique goals move slowly and are easy to misjudge, which is why so many people abandon a plan that was working. These articles cover the training and eating that reliably build muscle, how to run a cut or a gaining phase without wasting it, and how to measure progress so a slow week does not look like a failed month.",
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
  const slug = file.replace(/\.mdx$/, "");
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
    content,
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
        if (!file.endsWith(".mdx")) continue;
        const post = parsePost(category, file);
        if (post) posts.push(post);
      }
    }
  }
  posts.sort((a, b) => (a.publishedAt === b.publishedAt ? a.slug.localeCompare(b.slug) : b.publishedAt < a.publishedAt ? -1 : 1));
  // Cache only in production builds; in dev, re-read so new files show up without a restart.
  if (process.env.NODE_ENV === "production") cache = posts;
  return posts;
}

/** All visible posts, newest first. Drafts are excluded in production. */
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
