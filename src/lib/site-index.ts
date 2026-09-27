import { CATEGORIES, getAllPosts } from "@/lib/blog";
import { getAllTerms } from "@/lib/glossary";
import { getAllToolPages } from "@/lib/tool-pages";

/** Every public content URL with a title, so any page can render a link card for any other. */
export type IndexEntry = {
  url: string;
  title: string;
  description: string;
  kind: "article" | "hub" | "term" | "tool" | "page";
  section: string;
};

export const TOOLS_HUB = {
  url: "/tools",
  h1: "Gym Calculators for Lifters",
  title: "Gym calculators",
  keyword: "gym calculator",
  description:
    "Free gym calculators for lifters: one-rep max, RPE, bench press, protein, bulking calories, FFMI, lean body mass, recomposition, DOTS and Wilks, and barbell plates.",
};

export const GLOSSARY_HUB = {
  url: "/glossary",
  h1: "Gym Terms: A Glossary of Lifting Lingo",
  title: "Glossary",
  keyword: "gym terms",
  description:
    "Gym terms and lifting lingo explained properly: RPE, RIR, AMRAP, hypertrophy, mechanical tension, time under tension, newbie gains, dirty bulk and more.",
};

export function siteIndex(): IndexEntry[] {
  const out: IndexEntry[] = [];
  for (const c of CATEGORIES) {
    out.push({ url: `/blog/${c.slug}`, title: c.h1, description: c.description, kind: "hub", section: "Blog" });
  }
  for (const p of getAllPosts()) {
    const cat = CATEGORIES.find((c) => c.slug === p.category);
    out.push({
      url: `/blog/${p.category}/${p.slug}`,
      title: p.title,
      description: p.description,
      kind: "article",
      section: cat?.title ?? "Blog",
    });
  }
  out.push({ url: GLOSSARY_HUB.url, title: GLOSSARY_HUB.h1, description: GLOSSARY_HUB.description, kind: "hub", section: "Glossary" });
  for (const t of getAllTerms()) {
    out.push({ url: `/glossary/${t.slug}`, title: t.title, description: t.description, kind: "term", section: "Glossary" });
  }
  out.push({ url: TOOLS_HUB.url, title: TOOLS_HUB.h1, description: TOOLS_HUB.description, kind: "hub", section: "Tools" });
  for (const t of getAllToolPages()) {
    out.push({ url: `/tools/${t.slug}`, title: t.title, description: t.description, kind: "tool", section: "Tools" });
  }
  return out;
}

export function lookup(urls: string[]): IndexEntry[] {
  const idx = new Map(siteIndex().map((e) => [e.url, e]));
  return urls.map((u) => idx.get(u)).filter((e): e is IndexEntry => Boolean(e));
}
