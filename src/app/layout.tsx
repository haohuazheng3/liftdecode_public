import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
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
const display = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${BRAND} — Find out why your training stopped working`,
    template: `%s · ${BRAND}`,
  },
  description:
    "Answer 25 honest questions about how you train, eat, recover and measure progress. Get a detailed report on why you're stuck — and exactly what to change.",
  applicationName: BRAND,
  openGraph: {
    type: "website",
    siteName: BRAND,
    url: APP_URL,
    title: `${BRAND} — Find out why your training stopped working`,
    description:
      "A diagnostic for lifters who stopped progressing. Twenty-odd honest questions, one detailed answer to why.",
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
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${display.variable} h-full`}>
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
