"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "sent" | "error";
type Field = "name" | "email" | "message";
type FieldErrors = Partial<Record<Field, string>>;

const MIN_MESSAGE = 10;
const MAX_MESSAGE = 5000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Mirrors the zod schema in /api/contact so nobody gets a server rejection for something we could have said here. */
function validate(name: string, email: string, message: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!name.trim()) errors.name = "Tell us your name.";
  if (!EMAIL_RE.test(email.trim())) errors.email = "That email doesn't look right — check it for a typo.";
  const len = message.trim().length;
  if (len < MIN_MESSAGE) errors.message = `Tell us a little more — at least ${MIN_MESSAGE} characters.`;
  else if (len > MAX_MESSAGE) errors.message = `Please keep it under ${MAX_MESSAGE.toLocaleString("en")} characters.`;
  return errors;
}

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  // The submit button unmounts with the form, so focus would drop to <body>.
  // Put it on the confirmation instead, where the next thing to read is.
  useEffect(() => {
    if (status === "sent") doneRef.current?.focus();
  }, [status]);

  function clearFieldError(field: Field) {
    setFieldErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const errors = validate(name, email, message);
    if (errors.name || errors.email || errors.message) {
      setFieldErrors(errors);
      (errors.name ? nameRef : errors.email ? emailRef : messageRef).current?.focus();
      return;
    }
    setStatus("sending"); // instant — before the network
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim(), website }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "We couldn't send that. Please try again.");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "We couldn't send that. Please try again.");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="slab-inset p-5 sm:p-6 animate-rise">
        <div className="flex items-center gap-3 mb-2">
          <span className="grid place-items-center w-8 h-8 rounded-full bg-clear/15 text-clear" aria-hidden="true">
            ✓
          </span>
          <h3 ref={doneRef} tabIndex={-1} className="text-lg font-semibold outline-none">
            Got it.
          </h3>
        </div>
        <p className="text-ink-2 leading-relaxed">
          Your message is in. We reply to <span className="text-ink">{email.trim()}</span> within 2 business days — if
          you do not hear back by then, check your spam folder, then email us directly.
        </p>
        <button
          type="button"
          className="btn btn-quiet btn-sm mt-4"
          onClick={() => {
            setMessage("");
            setStatus("idle");
          }}
        >
          Send another
        </button>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="eyebrow block mb-2">
            Name
          </label>
          <input
            id="contact-name"
            ref={nameRef}
            className="input"
            name="name"
            autoComplete="name"
            required
            maxLength={120}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearFieldError("name");
            }}
            disabled={sending}
            aria-invalid={fieldErrors.name ? true : undefined}
            aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
          />
          {fieldErrors.name && (
            <p id="contact-name-error" className="mt-1.5 text-xs text-alert">
              {fieldErrors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="contact-email" className="eyebrow block mb-2">
            Email
          </label>
          <input
            id="contact-email"
            ref={emailRef}
            className="input"
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            required
            maxLength={200}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearFieldError("email");
            }}
            disabled={sending}
            aria-invalid={fieldErrors.email ? true : undefined}
            aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
          />
          {fieldErrors.email && (
            <p id="contact-email-error" className="mt-1.5 text-xs text-alert">
              {fieldErrors.email}
            </p>
          )}
        </div>
      </div>
      <div>
        <label htmlFor="contact-message" className="eyebrow block mb-2">
          Message
        </label>
        <textarea
          id="contact-message"
          ref={messageRef}
          className="input min-h-[160px] resize-y leading-relaxed"
          name="message"
          required
          maxLength={MAX_MESSAGE}
          placeholder="If it is about a report or a payment, include the email on the account and roughly when it happened."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            clearFieldError("message");
          }}
          disabled={sending}
          aria-invalid={fieldErrors.message ? true : undefined}
          aria-describedby={fieldErrors.message ? "contact-message-error contact-message-hint" : "contact-message-hint"}
        />
        <div className="mt-1.5 flex items-baseline justify-between gap-3">
          {fieldErrors.message ? (
            <p id="contact-message-error" className="text-xs text-alert">
              {fieldErrors.message}
            </p>
          ) : (
            <span />
          )}
          <span id="contact-message-hint" className="text-xs text-ink-3 tabular-nums whitespace-nowrap">
            {message.length} / {MAX_MESSAGE.toLocaleString("en")} · min {MIN_MESSAGE}
          </span>
        </div>
      </div>

      {/* honeypot: invisible to people, irresistible to bots */}
      <div className="absolute -left-[9999px] top-0 w-px h-px overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

      {error && (
        <p role="alert" className="text-sm text-alert">
          {error}
        </p>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <button type="submit" className="btn btn-primary sm:min-w-[180px]" disabled={sending} aria-busy={sending}>
          {sending ? "Sending…" : status === "error" ? "Try again" : "Send message"}
        </button>
        <p className="text-xs text-ink-3 leading-relaxed">
          What you type here is stored with your message and, if you accepted analytics cookies, also captured by
          FlowGlance.
        </p>
      </div>
    </form>
  );
}
