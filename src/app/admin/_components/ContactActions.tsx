"use client";

import { useState, useTransition } from "react";
import { setContactStatus, type ContactStatus } from "@/app/admin/actions";

const TONE: Record<ContactStatus, string> = { new: "tag-signal", replied: "tag-clear", spam: "tag-alert" };

/** Mark replied / spam / reopen with optimistic state. */
export function ContactActions({ id, status: initial }: { id: number; status: ContactStatus }) {
  const [status, setStatus] = useState<ContactStatus>(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function set(next: ContactStatus) {
    if (next === status) return;
    const prev = status;
    setStatus(next);
    setError(null);
    startTransition(async () => {
      const r = await setContactStatus(id, next);
      if (!r.ok) {
        setStatus(prev);
        setError(r.error);
      }
    });
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <span className={`tag ${TONE[status]}`}>{status}</span>
      <div className="flex flex-wrap gap-1.5" aria-busy={pending}>
        {status !== "replied" && (
          <button type="button" onClick={() => set("replied")} className="btn btn-ghost btn-sm">
            Mark replied
          </button>
        )}
        {status !== "spam" && (
          <button type="button" onClick={() => set("spam")} className="btn btn-quiet btn-sm">
            Spam
          </button>
        )}
        {status !== "new" && (
          <button type="button" onClick={() => set("new")} className="btn btn-quiet btn-sm">
            Reopen
          </button>
        )}
      </div>
      {error && (
        <span role="alert" className="text-xs text-alert">
          {error}
        </span>
      )}
    </div>
  );
}
