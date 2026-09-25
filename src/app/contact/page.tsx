import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/trust/PageHero";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Email contact@liftdecode.com or use the form. LiftDecode replies within 2 business days — about a report, a payment, a refund, or your account.",
};

const REASONS: { title: string; text: string }[] = [
  { title: "Something in the report is off", text: "Tell us what you answered and what you expected. This is how the rules get better." },
  { title: "Payment or refund", text: "Include the email on the account and the Stripe receipt. Refund rules are on the refunds page." },
  { title: "Account or data", text: "Change of email, deletion of your data, a copy of what we hold — all handled by email, from the address on the account." },
  { title: "Anything else", text: "Press, partnerships, a question about the method. Write plainly; we will answer plainly." },
];

export default function ContactPage() {
  return (
    <div className="px-3 sm:px-5 py-6 sm:py-10">
      <div className="mx-auto max-w-4xl space-y-4">
        <PageHero
          eyebrow="Contact"
          title={
            <>
              A real inbox, read by <em>people</em>.
            </>
          }
          lede="No ticket numbers, no chat widget. Write to us or use the form; either way it lands in the same place and we reply within 2 business days."
        >
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
            <a href="mailto:contact@liftdecode.com" className="btn btn-ghost">
              contact@liftdecode.com
            </a>
            <span className="text-sm text-ink-3">Reply within 2 business days · English</span>
          </div>
        </PageHero>

        <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr] lg:items-start">
          <div className="slab p-6 sm:p-8 animate-rise" style={{ animationDelay: "60ms" }}>
            <div className="eyebrow mb-4">Send a message</div>
            <ContactForm />
          </div>

          <div className="space-y-4">
            <div className="slab p-6 animate-rise" style={{ animationDelay: "120ms" }}>
              <div className="eyebrow mb-4">What to write about</div>
              <ul className="space-y-4">
                {REASONS.map((r) => (
                  <li key={r.title}>
                    <div className="text-ink font-medium">{r.title}</div>
                    <p className="text-sm text-ink-2 leading-relaxed mt-1">{r.text}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="slab p-6 animate-rise" style={{ animationDelay: "180ms" }}>
              <div className="eyebrow mb-3">Before you write</div>
              <ul className="space-y-2 text-sm">
                {[
                  ["/faq", "Frequently asked questions"],
                  ["/refunds", "Refunds & cancellation"],
                  ["/privacy", "Privacy policy"],
                ].map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="text-ink-2 hover:text-signal transition-colors underline underline-offset-2">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-ink-3 leading-relaxed">
                LiftDecode is not a medical service. If you are dealing with pain, injury or a health condition, please
                see a qualified professional rather than writing to us.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
