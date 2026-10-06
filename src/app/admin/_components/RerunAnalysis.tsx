"use client";

import { useState, useTransition } from "react";
import { rerunAnalysis } from "@/app/admin/actions";

/** Starts a failed or missing paid analysis again; the row's status flips to running at once. */
export function RerunAnalysis({ assessmentId }: { assessmentId: string }) {
  const [state, setState] = useState<"idle" | "started" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  return (
    <div className="flex flex-col items-start gap-1.5">
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        disabled={pending || state === "started"}
        aria-busy={pending}
        onClick={() => {
          setState("started");
          setError(null);
          startTransition(async () => {
            const r = await rerunAnalysis(assessmentId);
            if (!r.ok) {
              setState("error");
              setError(r.error);
            }
          });
        }}
      >
        {state === "started" ? "Running…" : "Re-run"}
      </button>
      {error && (
        <span role="alert" className="text-xs text-alert">
          {error}
        </span>
      )}
    </div>
  );
}
