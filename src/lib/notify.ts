/**
 * Owner notifications (new contact message, etc.) via the Cloudflare Email
 * Worker. Configured with EMAIL_WORKER_URL + EMAIL_WORKER_SECRET; when either
 * is missing the call degrades to a console warning so the calling request
 * still succeeds. Never throws.
 */
export interface NotifyInput {
  subject: string;
  text: string;
}

export async function notifyOwner(input: NotifyInput): Promise<boolean> {
  const base = process.env.EMAIL_WORKER_URL?.replace(/\/+$/, "");
  const secret = process.env.EMAIL_WORKER_SECRET;
  if (!base || !secret) {
    console.warn("[notify] EMAIL_WORKER_URL / EMAIL_WORKER_SECRET not set — owner not notified:", input.subject);
    return false;
  }
  try {
    const res = await fetch(`${base}/notify`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${secret}` },
      body: JSON.stringify({ subject: input.subject.slice(0, 200), text: input.text.slice(0, 20000) }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.warn(`[notify] worker responded ${res.status} for:`, input.subject);
      return false;
    }
    return true;
  } catch (e) {
    console.warn("[notify] request failed:", e instanceof Error ? e.message : e, "subject:", input.subject);
    return false;
  }
}
