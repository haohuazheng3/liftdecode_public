import { gzipSync } from "node:zlib";
import { eq, getTableName, is, lt } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { backups } from "@/lib/db/schema";
import { r2Config, r2Delete, r2Put, type R2Config } from "@/lib/r2";
import { captureFromUnknown } from "@/lib/errors";

/** Per-table row cap so a runaway table cannot blow the function's memory. */
export const BACKUP_ROW_CAP = 50_000;

/**
 * How long a nightly copy lives before the same job deletes it. The privacy
 * policy states this number (data deleted on request is gone from backups
 * within this window), so change the two together.
 */
export const BACKUP_RETENTION_DAYS = 30;

export type BackupResult =
  | { skipped: "r2 not configured"; tables: Record<string, number> }
  | {
      objectKey: string;
      bytes: number;
      rawBytes: number;
      tables: Record<string, number>;
      truncated: string[];
      /** object keys removed because they were older than BACKUP_RETENTION_DAYS */
      pruned: string[];
    };

/** Every pgTable exported from the schema module, keyed by its SQL name. */
export function schemaTables(): Array<{ name: string; table: PgTable }> {
  return (Object.values(schema) as unknown[])
    .filter((v): v is PgTable => is(v, PgTable))
    .map((table) => ({ name: getTableName(table), table }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Read every table (capped) into one plain object. */
export async function dumpDatabase(): Promise<{
  data: Record<string, Record<string, unknown>[]>;
  counts: Record<string, number>;
  truncated: string[];
}> {
  const data: Record<string, Record<string, unknown>[]> = {};
  const counts: Record<string, number> = {};
  const truncated: string[] = [];
  for (const { name, table } of schemaTables()) {
    const rows = (await db.select().from(table).limit(BACKUP_ROW_CAP)) as Record<string, unknown>[];
    data[name] = rows;
    counts[name] = rows.length;
    if (rows.length >= BACKUP_ROW_CAP) truncated.push(name);
  }
  return { data, counts, truncated };
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Delete every backup older than BACKUP_RETENTION_DAYS, object first and log
 * row second, so a failure between the two is retried next night (a repeated
 * DELETE on a missing key is a no-op).
 */
export async function pruneBackups(cfg: R2Config, now = new Date()): Promise<string[]> {
  const cutoff = new Date(now.getTime() - BACKUP_RETENTION_DAYS * 24 * 3600 * 1000);
  const old = await db
    .select({ id: backups.id, objectKey: backups.objectKey })
    .from(backups)
    .where(lt(backups.createdAt, cutoff));
  const pruned: string[] = [];
  for (const b of old) {
    await r2Delete(cfg, b.objectKey);
    await db.delete(backups).where(eq(backups.id, b.id));
    pruned.push(b.objectKey);
  }
  return pruned;
}

/**
 * Nightly export: every table → one gzip'd JSON document in R2 under
 * backups/<YYYY-MM-DD>.json.gz, plus a row in `backups` so the admin page
 * can show when the last successful copy was taken.
 */
export async function runBackup(now = new Date()): Promise<BackupResult> {
  const cfg = r2Config();
  const { data, counts, truncated } = await dumpDatabase();

  if (!cfg) {
    console.warn("[backup] R2 is not configured (R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY / R2_BUCKET); skipping upload");
    return { skipped: "r2 not configured", tables: counts };
  }

  const document = {
    site: "liftdecode.com",
    takenAt: now.toISOString(),
    rowCap: BACKUP_ROW_CAP,
    truncated,
    counts,
    tables: data,
  };
  const raw = Buffer.from(JSON.stringify(document), "utf8");
  const gz = gzipSync(raw, { level: 9 });
  const objectKey = `backups/${isoDate(now)}.json.gz`;

  await r2Put(cfg, objectKey, new Uint8Array(gz.buffer, gz.byteOffset, gz.byteLength), "application/gzip", {
    "content-encoding": "gzip",
    "x-amz-meta-taken-at": now.toISOString(),
  });

  await db.insert(backups).values({ objectKey, bytes: gz.byteLength, tables: counts });

  let pruned: string[] = [];
  try {
    pruned = await pruneBackups(cfg, now);
  } catch (e) {
    // tonight's copy is safe; a failed prune lands in the error inbox and is retried tomorrow
    await captureFromUnknown(e, "lib/backup#prune");
  }

  return { objectKey, bytes: gz.byteLength, rawBytes: raw.byteLength, tables: counts, truncated, pruned };
}
