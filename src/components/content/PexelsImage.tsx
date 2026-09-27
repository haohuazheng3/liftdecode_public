"use client";

import Image, { type ImageLoaderProps } from "next/image";

/**
 * Pexels photos are served straight from the Pexels CDN, which resizes and compresses
 * on the fly (`auto=compress&cs=tinysrgb&w=`). A custom loader keeps them out of the
 * Vercel image optimiser while still giving the browser a proper responsive srcset.
 */
function pexelsLoader({ src, width, quality }: ImageLoaderProps): string {
  const url = new URL(src);
  url.search = "";
  url.searchParams.set("auto", "compress");
  url.searchParams.set("cs", "tinysrgb");
  url.searchParams.set("w", String(width));
  if (quality) url.searchParams.set("q", String(quality));
  return url.toString();
}

export function PexelsImage({
  src,
  alt,
  width,
  height,
  sizes = "(min-width: 768px) 720px, 100vw",
  eager = false,
  className = "",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  eager?: boolean;
  className?: string;
}) {
  return (
    <Image
      loader={pexelsLoader}
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      className={`w-full h-auto rounded-2xl border border-line bg-white/[0.03] ${className}`}
    />
  );
}
