import type { MetadataRoute } from "next";
import { CATEGORIES, getAllPosts, type Post } from "@/lib/blog";
import { LAUNCH_DATE, STATIC_ROUTES, absoluteUrl, isPrivatePath } from "@/lib/seo";

type Entry = MetadataRoute.Sitemap[number];

function toDate(iso: string | undefined, fallback: Date): Date {
  if (!iso) return fallback;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? fallback : d;
}

function postEntry(p: Post): Entry {
  return {
    url: absoluteUrl(`/blog/${p.category}/${p.slug}`),
    lastModified: toDate(p.updatedAt || p.publishedAt, LAUNCH_DATE),
    changeFrequency: "monthly",
    priority: 0.6,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: Entry[] = STATIC_ROUTES.map((r) => ({
    url: absoluteUrl(r.path),
    lastModified: LAUNCH_DATE,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  let posts: Post[] = [];
  try {
    posts = getAllPosts().filter((p) => !p.draft);
  } catch (e) {
    // The sitemap must still ship the static pages even if the blog index fails to read.
    console.error("[sitemap] could not load blog posts", e);
  }

  const postEntries = posts.map(postEntry);

  // A category page is listed only once it has something to show; its lastmod is its newest post.
  const categoryEntries: Entry[] = CATEGORIES.flatMap((c) => {
    const own = postEntries.filter((_, i) => posts[i].category === c.slug);
    if (own.length === 0) return [];
    const latest = own.reduce<Date>((acc, e) => {
      const d = e.lastModified instanceof Date ? e.lastModified : null;
      return d && d > acc ? d : acc;
    }, LAUNCH_DATE);
    return [
      {
        url: absoluteUrl(`/blog/${c.slug}`),
        lastModified: latest,
        changeFrequency: "weekly",
        priority: 0.5,
      },
    ];
  });

  const seen = new Set<string>();
  return [...staticEntries, ...categoryEntries, ...postEntries].filter((e) => {
    const path = e.url.replace(/^https?:\/\/[^/]+/i, "") || "/";
    if (isPrivatePath(path) || seen.has(e.url)) return false;
    seen.add(e.url);
    return true;
  });
}
