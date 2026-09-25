"use client";

import { useState, useTransition } from "react";
import { setErrorResolved } from "@/app/admin/actions";

/** Resolve / Reopen with optimistic state: the tag flips before the server answers. */
export function ErrorActions({ id, resolved: initial }: { id: number; resolved: boolean }) {
  const [resolved, setResolved] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function set(next: boolean) {
    const prev = resolved;
    setResolved(next);
    setError(null);
    startTransition(async () => {
      const r = await setErrorResolved(id, next);
      if (!r.ok) {
        setResolved(prev);
        setError(r.error);
      }
    });
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <span className={`tag ${resolved ? "tag-clear" : "tag-alert"}`}>{resolved ? "Resolved" : "Open"}</span>
      <button
        type="button"
        onClick={() => set(!resolved)}
        aria-busy={pending}
        className="btn btn-ghost btn-sm"
      >
        {resolved ? "Reopen" : "Resolve"}
      </button>
      {error && (
        <span role="alert" className="text-xs text-alert">
          {error}
        </span>
      )}
    </div>
  );
}
