import Link from "next/link";
import { LogoMark } from "./Logo";
import { CONTACT_EMAIL } from "@/lib/env";

const COLS = [
  {
    title: "Product",
    links: [
      { href: "/diagnose", label: "Start diagnosis" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/pricing", label: "Pricing" },
      { href: "/library", label: "Fix library" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms of service" },
      { href: "/refunds", label: "Refunds & cancellation" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 px-4 pb-10 sm:px-6 no-print">
      <div className="mx-auto max-w-6xl">
        <div className="hairline mb-10" />
        <div className="grid gap-10 sm:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              aria-label="LiftDecode home"
              className="inline-grid place-items-center w-11 h-11 rounded-[12px] bg-slab border border-line text-ink hover:border-line-2 active:scale-[0.94] transition-[transform,border-color] duration-150"
            >
              <LogoMark size={20} />
            </Link>
            <p className="mt-4 text-sm text-ink-3 max-w-xs leading-relaxed">
              A diagnostic for lifters who stopped progressing. Honest answers in, one clear bottleneck and the plan to
              break it out.
            </p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="mt-4 inline-block text-sm text-ink-2 hover:text-signal">
              {CONTACT_EMAIL}
            </a>
          </div>
          {COLS.map((c) => (
            <div key={c.title}>
              <div className="eyebrow mb-3">{c.title}</div>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-ink-2 hover:text-ink transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-ink-3">
          <span>© {year} LiftDecode. All rights reserved.</span>
          <span>Training and nutrition education — not medical advice.</span>
        </div>
      </div>
    </footer>
  );
}
