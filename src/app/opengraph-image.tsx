import { ImageResponse } from "next/og";
import { SITE_TAGLINE } from "@/lib/seo";

export const alt = `LiftDecode — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Same geometry as <LogoMark> (src/components/Logo.tsx). The social card uses the monochrome mark.
const MARK = "M4 32H15L32 49V60H21L4 43ZM32 4H43L60 21V32H49L32 15ZM21.5 34.5L34.5 21.5L42.5 29.5L29.5 42.5Z";

const WORD_A = "LIFT";
const WORD_B = "DECODE";
const HEADLINE = SITE_TAGLINE.toUpperCase();
const SUBLINE = "A diagnostic for lifters who stopped progressing";
const PILLS = ["FIND THE BOTTLENECK", "GET THE PLAN"];

const DISPLAY = "Big Shoulders";

/**
 * Big Shoulders (the site's display face) as a TrueType file, subset to the glyphs on this card.
 * Google Fonts serves `format('truetype')` to a client that sends no browser user agent.
 * If the fetch fails the card still renders in the bundled sans; the failure is logged, not hidden.
 */
async function loadDisplayFont(weight: number): Promise<ArrayBuffer | null> {
  const text = Array.from(new Set(`${WORD_A}${WORD_B}${HEADLINE}${PILLS.join("")}`)).join("");
  const cssUrl = `https://fonts.googleapis.com/css2?family=Big+Shoulders:wght@${weight}&text=${encodeURIComponent(text)}`;
  try {
    const css = await (await fetch(cssUrl)).text();
    const src = css.match(/src:\s*url\(([^)]+)\)\s*format\('(?:truetype|opentype)'\)/)?.[1];
    if (!src) throw new Error(`no truetype src in Google Fonts CSS for weight ${weight}`);
    const res = await fetch(src);
    if (!res.ok) throw new Error(`font download ${res.status}`);
    return await res.arrayBuffer();
  } catch (err) {
    console.error("[opengraph-image] display font unavailable, falling back to sans", err);
    return null;
  }
}

export default async function OpenGraphImage() {
  const [heavy, black] = await Promise.all([loadDisplayFont(800), loadDisplayFont(900)]);
  const fonts = [
    ...(heavy ? [{ name: DISPLAY, data: heavy, weight: 800 as const, style: "normal" as const }] : []),
    ...(black ? [{ name: DISPLAY, data: black, weight: 900 as const, style: "normal" as const }] : []),
  ];
  const display = fonts.length ? `"${DISPLAY}", sans-serif` : "sans-serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#08080b",
          backgroundImage:
            "radial-gradient(60% 50% at 18% -10%, rgba(245,181,68,0.14), transparent 70%), radial-gradient(40% 40% at 100% 100%, rgba(255,255,255,0.05), transparent 70%)",
          color: "#f3f2ee",
          fontFamily: "sans-serif",
          overflow: "hidden",
        }}
      >
        {/* oversized mark bleeding off the right edge: texture, not a second logo */}
        <svg
          width="560"
          height="560"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", right: -150, top: 110, opacity: 0.06 }}
        >
          <path fill="#f3f2ee" d={MARK} />
        </svg>

        {/* mark + brand name (live text beside the mark, never inside it) */}
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <svg width="76" height="76" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <path fill="#f3f2ee" d={MARK} />
          </svg>
          <div
            style={{
              display: "flex",
              fontFamily: display,
              fontWeight: 800,
              fontSize: 52,
              letterSpacing: 1,
              lineHeight: 1,
            }}
          >
            <span style={{ display: "flex" }}>{WORD_A}</span>
            <span style={{ display: "flex", color: "#f5b544" }}>{WORD_B}</span>
          </div>
        </div>

        {/* headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              display: "flex",
              fontFamily: display,
              fontWeight: 900,
              fontSize: fonts.length ? 100 : 72,
              lineHeight: 0.9,
              letterSpacing: fonts.length ? 0 : -2,
              maxWidth: 820,
            }}
          >
            {HEADLINE}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 20,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#b1b0ab",
            }}
          >
            {SUBLINE}
          </div>
        </div>

        {/* footer line */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: 28,
            color: "#8a8990",
            fontSize: 24,
          }}
        >
          <div style={{ display: "flex" }}>liftdecode.com</div>
          <div style={{ display: "flex", gap: 10 }}>
            {PILLS.map((p, i) => (
              <div
                key={p}
                style={{
                  display: "flex",
                  padding: "8px 18px",
                  borderRadius: 999,
                  border: i === 0 ? "1px solid rgba(245,181,68,0.45)" : "1px solid rgba(255,255,255,0.14)",
                  color: i === 0 ? "#f5b544" : "#b1b0ab",
                  fontFamily: display,
                  fontWeight: 800,
                  letterSpacing: 1.5,
                  fontSize: 24,
                }}
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
