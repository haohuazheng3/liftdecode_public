import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

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
        <svg width="132" height="132" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 16H13V48H22" stroke="#f3f2ee" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M42 16H51V48H42" stroke="#f3f2ee" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M25 32H39" stroke="#f5b544" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </div>
    ),
    size,
  );
}
