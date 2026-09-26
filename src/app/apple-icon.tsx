import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Same geometry as <LogoMark> (src/components/Logo.tsx): ink heads, amber handle, stencil gaps.
const HEADS = "M4 32H15L32 49V60H21L4 43ZM32 4H43L60 21V32H49L32 15Z";
const HANDLE = "M21.5 34.5L34.5 21.5L42.5 29.5L29.5 42.5Z";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#08080b",
          borderRadius: 40,
        }}
      >
        <svg width="124" height="124" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <path fill="#f3f2ee" d={HEADS} />
          <path fill="#f5b544" d={HANDLE} />
        </svg>
      </div>
    ),
    size,
  );
}
