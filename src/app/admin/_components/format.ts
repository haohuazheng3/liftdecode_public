/** Small, dependency-free formatters for the admin tables. All dates are shown in UTC. */

function toDate(d: Date | string | null | undefined): Date | null {
  if (!d) return null;
  const date = typeof d === "string" ? new Date(d) : d;
  return Number.isNaN(date.getTime()) ? null : date;
}

/** `2026-09-25 14:03` (UTC) */
export function fmtDate(d: Date | string | null | undefined): string {
  const date = toDate(d);
  if (!date) return "—";
  const iso = date.toISOString();
  return `${iso.slice(0, 10)} ${iso.slice(11, 16)}`;
}

/** `2026-09-25` (UTC) */
export function fmtDay(d: Date | string | null | undefined): string {
  const date = toDate(d);
  return date ? date.toISOString().slice(0, 10) : "—";
}

/** `just now`, `4m ago`, `3h ago`, `6d ago`, else the day */
export function ago(d: Date | string | null | undefined): string {
  const date = toDate(d);
  if (!date) return "—";
  const s = Math.max(0, Math.round((Date.now() - date.getTime()) / 1000));
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 48) return `${h}h ago`;
  const days = Math.round(h / 24);
  if (days < 30) return `${days}d ago`;
  return fmtDay(date);
}

/** cents + ISO currency → `$15.00` */
export function fmtMoney(cents: number | null | undefined, currency: string | null | undefined = "usd"): string {
  const amount = (cents ?? 0) / 100;
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: (currency ?? "usd").toUpperCase() }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${(currency ?? "").toUpperCase()}`.trim();
  }
}

export function fmtInt(n: number | null | undefined): string {
  return (n ?? 0).toLocaleString("en-US");
}

/** seconds → `4m 12s` */
export function fmtDuration(seconds: number | null | undefined): string {
  if (!seconds || seconds <= 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

/** keep ids readable in narrow columns: `user_2ab…9f` */
export function shortId(id: string | null | undefined, keep = 8): string {
  if (!id) return "—";
  if (id.length <= keep * 2 + 1) return id;
  return `${id.slice(0, keep)}…${id.slice(-4)}`;
}
