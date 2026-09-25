import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { count, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { contactMessages, errorEvents } from "@/lib/db/schema";
import { isAdminEmail } from "@/lib/env";
import { captureFromUnknown } from "@/lib/errors";
import { AdminNav, type AdminBadges } from "./_components/AdminNav";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  description: "LiftDecode owner panel.",
  robots: { index: false, follow: false, nocache: true },
};

async function badges(): Promise<AdminBadges> {
  try {
    const [[e], [c]] = await Promise.all([
      db.select({ n: count() }).from(errorEvents).where(isNull(errorEvents.resolvedAt)),
      db.select({ n: count() }).from(contactMessages).where(eq(contactMessages.status, "new")),
    ]);
    return { errors: e?.n ?? 0, contact: c?.n ?? 0 };
  } catch (e) {
    await captureFromUnknown(e, "admin/layout:badges");
    return { errors: 0, contact: 0 };
  }
}

export default async function AdminLayout(props: LayoutProps<"/admin">) {
  const cu = await currentUser();
  if (!isAdminEmail(cu?.primaryEmailAddress?.emailAddress)) notFound();
  const b = await badges();

  return (
    <div className="px-3 sm:px-5 py-4 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <AdminNav badges={b} />
        <div className="animate-rise">{props.children}</div>
      </div>
    </div>
  );
}
