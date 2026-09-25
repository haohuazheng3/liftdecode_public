import { ImageResponse } from "next/og";
import { SITE_TAGLINE } from "@/lib/seo";

export const alt = `LiftDecode — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#08080b",
          backgroundImage:
            "radial-gradient(60% 45% at 50% -10%, rgba(245,181,68,0.16), transparent 70%), radial-gradient(35% 30% at 95% 100%, rgba(121,224,179,0.06), transparent 70%)",
          color: "#f3f2ee",
          fontFamily: "sans-serif",
        }}
      >
        {/* mark + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "#f3f2ee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="50" height="50" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 16H13V48H22" stroke="#08080b" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M42 16H51V48H42" stroke="#08080b" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M25 32H39" stroke="#08080b" strokeWidth="6" strokeLinecap="round" />
            </svg>
          </div>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 600, letterSpacing: -1 }}>
            <span style={{ display: "flex" }}>Lift</span>
            <span style={{ display: "flex", color: "#f5b544", marginLeft: -2 }}>Decode</span>
          </div>
        </div>

        {/* headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              fontSize: 84,
              lineHeight: 1.02,
              letterSpacing: -3,
              fontWeight: 500,
              maxWidth: 1000,
            }}
          >
            {SITE_TAGLINE}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                display: "flex",
                fontSize: 20,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: "#b1b0ab",
              }}
            >
              A diagnostic for lifters who stopped progressing
            </div>
          </div>
        </div>

        {/* slab footer line */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: 28,
            color: "#75747a",
            fontSize: 24,
          }}
        >
          <div style={{ display: "flex" }}>liftdecode.com</div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ display: "flex", padding: "8px 16px", borderRadius: 999, border: "1px solid rgba(245,181,68,0.4)", color: "#f5b544", fontSize: 20 }}>
              25 questions
            </div>
            <div style={{ display: "flex", padding: "8px 16px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.14)", color: "#b1b0ab", fontSize: 20 }}>
              One detailed report
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
