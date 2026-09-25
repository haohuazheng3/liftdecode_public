import { NextResponse } from "next/server";
import { z } from "zod";
import sitemap from "@/app/sitemap";
import { captureFromUnknown } from "@/lib/errors";
import { INDEXNOW_KEY, SITE_URL, absoluteUrl } from "@/lib/seo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROUTE = "POST /api/indexnow";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const MAX_URLS = 10_000;

const Body = z
  .object({
    urls: z.array(z.string().min(1).max(2048)).max(MAX_URLS).optional(),
  })
  .optional();

function authorized(req: Request): boolean | null {
  const secret = process.env.CRON_SECRET;
  if (!secret) return null;
  const header = req.headers.get("authorization") ?? "";
  return header === `Bearer ${secret}`;
}

/** Only ever submit URLs on our own host. Anything else is dropped, not forwarded. */
function normalize(urls: string[]): string[] {
  const host = new URL(SITE_URL).host;
  const out = new Set<string>();
  for (const raw of urls) {
    try {
      const u = new URL(absoluteUrl(raw));
      if (u.host !== host) continue;
      u.hash = "";
      out.add(u.toString());
    } catch {
      // not a URL — skip
    }
  }
  return [...out];
}

/**
 * Pings IndexNow (Bing, Yandex, Naver, Seznam and friends) with changed URLs.
 * Protected by CRON_SECRET; call it after a deploy or when a post is published.
 */
export async function POST(req: Request) {
  try {
    const auth = authorized(req);
    if (auth === null) return NextResponse.json({ error: "CRON_SECRET is not configured" }, { status: 503 });
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const text = await req.text().catch(() => "");
    let json: unknown = undefined;
    if (text.trim()) {
      try {
        json = JSON.parse(text);
      } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
      }
    }
    const parsed = Body.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    const requested = parsed.data?.urls;
    const urlList = normalize(requested && requested.length > 0 ? requested : sitemap().map((e) => e.url));
    if (urlList.length === 0) return NextResponse.json({ error: "No URLs on this host to submit" }, { status: 400 });

    const host = new URL(SITE_URL).host;
    const payload = {
      host,
      key: INDEXNOW_KEY,
      keyLocation: absoluteUrl(`/${INDEXNOW_KEY}.txt`),
      urlList,
    };
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const detail = (await res.text().catch(() => "")).slice(0, 500);
    const ok = res.status === 200 || res.status === 202;
    if (!ok) {
      await captureFromUnknown(new Error(`IndexNow responded ${res.status}: ${detail || "no body"}`), ROUTE, "server", {
        status: res.status,
        submitted: urlList.length,
      });
    }
    return NextResponse.json(
      { ok, status: res.status, submitted: urlList.length, keyLocation: payload.keyLocation, detail: detail || null },
      { status: ok ? 200 : 502, headers: { "cache-control": "no-store" } },
    );
  } catch (e) {
    await captureFromUnknown(e, ROUTE);
    return NextResponse.json({ ok: false, error: "IndexNow submission failed" }, { status: 500 });
  }
}
