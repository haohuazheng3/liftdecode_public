import type { ContentImage } from "@/lib/content";
import { PexelsImage } from "./PexelsImage";

/** A Pexels photo with the photographer credit the Pexels licence asks for. */
export function Figure({ image, eager = false }: { image: ContentImage; eager?: boolean }) {
  return (
    <figure className="my-8">
      <PexelsImage
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        eager={eager}
      />
      {image.credit && (
        <figcaption className="mt-2 text-xs text-ink-3">
          Photo:{" "}
          {image.creditUrl ? (
            <a href={image.creditUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-line-2 underline-offset-2 hover:text-ink-2">
              {image.credit}
            </a>
          ) : (
            image.credit
          )}{" "}
          on{" "}
          <a
            href={image.pageUrl || "https://www.pexels.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-line-2 underline-offset-2 hover:text-ink-2"
          >
            Pexels
          </a>
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Inline images are written in Markdown as
 * `![alt](https://images.pexels.com/... "pexels|Credit|creditUrl|pageUrl|1260x840")`.
 * Returns null for anything that is not a well-formed Pexels image.
 */
export function imageFromMarkdown(src: string | undefined, alt: string | undefined, title: string | undefined): ContentImage | null {
  if (!src || !src.startsWith("https://images.pexels.com/") || !alt || !title?.startsWith("pexels|")) return null;
  const [, credit = "", creditUrl = "", pageUrl = "", size = ""] = title.split("|");
  const m = /^(\d+)x(\d+)$/.exec(size.trim());
  if (!m) return null;
  return { src, alt, credit, creditUrl, pageUrl, width: Number(m[1]), height: Number(m[2]) };
}
