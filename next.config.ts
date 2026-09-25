import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const CLERK = [
  "https://*.clerk.accounts.dev",
  "https://clerk.liftdecode.com",
  "https://*.clerk.com",
  "https://img.clerk.com",
];
const CLERK_WS = ["wss://*.clerk.accounts.dev", "wss://clerk.liftdecode.com", "wss://*.clerk.com"];
const STRIPE = ["https://js.stripe.com", "https://checkout.stripe.com", "https://api.stripe.com", "https://m.stripe.network"];
const FLOWGLANCE = ["https://flowglance.com"];
const TURNSTILE = ["https://challenges.cloudflare.com"];

// Pages are static (no per-request nonce), so Next.js needs 'unsafe-inline' for its
// hydration scripts; 'unsafe-eval' is only added for the dev server's hot reload.
const csp = [
  ["default-src", "'self'"],
  ["script-src", "'self'", "'unsafe-inline'", ...(isDev ? ["'unsafe-eval'"] : []), ...CLERK, ...STRIPE, ...FLOWGLANCE, ...TURNSTILE],
  ["style-src", "'self'", "'unsafe-inline'"],
  ["img-src", "'self'", "data:", "blob:", "https:"],
  ["font-src", "'self'", "data:"],
  ["connect-src", "'self'", ...CLERK, ...CLERK_WS, ...STRIPE, ...FLOWGLANCE, ...TURNSTILE],
  ["frame-src", ...STRIPE.slice(0, 2), ...TURNSTILE, "https://*.clerk.com", "https://*.clerk.accounts.dev", "https://clerk.liftdecode.com"],
  ["worker-src", "'self'", "blob:"],
  ["media-src", "'self'"],
  ["object-src", "'none'"],
  ["base-uri", "'self'"],
  ["form-action", "'self'", "https://checkout.stripe.com"],
  ["frame-ancestors", "'none'"],
  ["upgrade-insecure-requests"],
]
  .map((directive) => directive.join(" "))
  .join("; ");

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: 'camera=(), microphone=(), geolocation=(), payment=(self "https://js.stripe.com")',
  },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "img.clerk.com" }],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Development-period noindex (removed at launch)
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          ...securityHeaders,
        ],
      },
    ];
  },
};

export default nextConfig;
