import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Neon HTTP driver over the pooled connection string — one HTTP round-trip per
 * query, no connection to hold, safe under serverless concurrency.
 *
 * The client is created lazily on first use so that importing this module
 * during `next build` (where DATABASE_URL may be absent) never throws.
 */
type Db = ReturnType<typeof createDb>;

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not configured");
  }
  const sql = neon(url);
  return drizzle({ client: sql, schema, casing: "snake_case" });
}

declare global {
  var __liftdecodeDb: Db | undefined;
}

function getDb(): Db {
  if (!globalThis.__liftdecodeDb) globalThis.__liftdecodeDb = createDb();
  return globalThis.__liftdecodeDb;
}

export const db: Db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    const real = getDb();
    const value = Reflect.get(real, prop, receiver);
    return typeof value === "function" ? value.bind(real) : value;
  },
});

export { schema };
