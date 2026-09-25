import Link from "next/link";

export function MembershipUpsell({ title, text }: { title: string; text: string }) {
  return (
    <div className="slab p-6 sm:p-8">
      <div className="tag tag-signal mb-3">Membership</div>
      <h2 className="display text-2xl sm:text-3xl">{title}</h2>
      <p className="mt-3 text-ink-2 leading-relaxed max-w-xl">{text}</p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2 text-sm text-ink-2">
        {[
          "Unlimited re-diagnoses, both tracks",
          "Plateau tracker with stall flags",
          "Compare any two reports",
          "Every report unlocked while you're a member",
          "Full fix library, every protocol",
          "$15 / month, cancel any time",
        ].map((x) => (
          <li key={x} className="flex gap-2">
            <span className="text-signal" aria-hidden="true">
              ›
            </span>
            {x}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Link href="/pricing?intent=membership" className="btn btn-primary">
          Become a member — $15/month
        </Link>
        <Link href="/pricing" className="btn btn-ghost">
          Compare with a single report
        </Link>
      </div>
    </div>
  );
}
