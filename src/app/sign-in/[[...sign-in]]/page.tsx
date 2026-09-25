import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { LogoMark } from "@/components/Logo";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

/**
 * One door for everyone: type your email, get a code, you're in.
 * New emails are registered automatically (Clerk sign-in-or-up flow).
 */
export default function SignInPage() {
  return (
    <div className="px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-md">
        <div className="text-center mb-6">
          <span className="inline-grid place-items-center w-12 h-12 rounded-[14px] bg-ink text-void mb-4">
            <LogoMark size={26} />
          </span>
          <h1 className="display text-3xl sm:text-4xl">
            Your email is your <em>key</em>.
          </h1>
          <p className="mt-2 text-ink-2 text-sm">
            No password. We send a 6-digit code — first time here, this also creates your account.
          </p>
        </div>
        <div className="flex justify-center">
          <SignIn withSignUp routing="path" path="/sign-in" />
        </div>
      </div>
    </div>
  );
}
