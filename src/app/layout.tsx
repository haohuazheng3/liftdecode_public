import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Big_Shoulders_Stencil, Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Analytics } from "@/components/Analytics";
import { CookieConsent } from "@/components/CookieConsent";
import { ClientErrorReporter } from "@/components/ClientErrorReporter";
import { JsonLd } from "@/components/JsonLd";
import { APP_URL, BRAND } from "@/lib/env";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
// Athletic display face: condensed, heavy, gym-signage energy. One variable file
// (CSS uses 700–900) with the optical-size axis, so big headlines get the tight display cut.
// next/font has no fallback metrics for either Big Shoulders cut, so it emits the bare family
// name; the explicit fallback keeps headlines condensed sans (not the browser's serif) while
// the file loads, and turning the metric adjustment off silences the build warning.
const display = Big_Shoulders({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz"],
  fallback: ["Impact", "Arial Narrow", "sans-serif"],
  adjustFontFallback: false,
});
// Stencil cut for numerals and the stall ticker only (homepage) — not preloaded site-wide.
const stencil = Big_Shoulders_Stencil({
  variable: "--font-stencil",
  subsets: ["latin"],
  weight: "800",
  preload: false,
  fallback: ["Big Shoulders", "Impact", "sans-serif"],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${BRAND} — Find out why your training stopped working`,
    template: `%s · ${BRAND}`,
  },
  description:
    "Find the real reason your training stopped working — and what to change first. A diagnostic that reads your training, effort, food, sleep and recovery.",
  applicationName: BRAND,
  openGraph: {
    type: "website",
    siteName: BRAND,
    url: APP_URL,
    title: `${BRAND} — Find out why your training stopped working`,
    description:
      "Find the real reason your training stopped working — and what to change first. Training, food, sleep and recovery, decoded.",
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#08080b",
  // No viewportFit: "cover" — nothing draws edge to edge, and cover would push the
  // sticky header and slab text under the notch in landscape on notched iPhones.
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider
      appearance={{
        theme: dark,
        variables: {
          colorPrimary: "#f5b544",
          colorBackground: "#121217",
          colorForeground: "#f3f2ee",
          colorMutedForeground: "#b1b0ab",
          colorInput: "#0c0c10",
          colorInputForeground: "#f3f2ee",
          borderRadius: "16px",
          fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
        },
        elements: {
          card: "shadow-none border border-white/10",
          formButtonPrimary: "text-[#14100a] font-semibold",
          footer: "hidden",
        },
      }}
      signInUrl="/sign-in"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${display.variable} ${stencil.variable} h-full`}>
        <body className="min-h-full flex flex-col">
          <JsonLd />
          <div className="void-bg" aria-hidden="true" />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieConsent />
          <Analytics />
          <ClientErrorReporter />
        </body>
      </html>
    </ClerkProvider>
  );
}
