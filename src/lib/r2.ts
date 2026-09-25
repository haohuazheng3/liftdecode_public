import { AwsClient } from "aws4fetch";

/**
 * Cloudflare R2 through its S3-compatible API, signed with aws4fetch.
 * Configuration is optional: when any variable is missing the caller gets
 * `null` and should degrade (skip the upload, say so) rather than throw.
 */
export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
}

export function r2Config(): R2Config | null {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET;
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) return null;
  return { accountId, accessKeyId, secretAccessKey, bucket };
}

function client(cfg: R2Config): AwsClient {
  return new AwsClient({
    accessKeyId: cfg.accessKeyId,
    secretAccessKey: cfg.secretAccessKey,
    service: "s3",
    region: "auto",
  });
}

export function r2ObjectUrl(cfg: R2Config, key: string): string {
  const cleanKey = key.replace(/^\/+/, "").split("/").map(encodeURIComponent).join("/");
  return `https://${cfg.accountId}.r2.cloudflarestorage.com/${cfg.bucket}/${cleanKey}`;
}

/** Upload one object. Throws with the R2 error body on a non-2xx response. */
export async function r2Put(
  cfg: R2Config,
  key: string,
  body: Uint8Array,
  contentType = "application/octet-stream",
  extraHeaders: Record<string, string> = {},
): Promise<{ key: string; bytes: number; etag: string | null }> {
  // Copy into a plain ArrayBuffer so fetch/undici sees a standard body type.
  const buf = new ArrayBuffer(body.byteLength);
  new Uint8Array(buf).set(body);
  const res = await client(cfg).fetch(r2ObjectUrl(cfg, key), {
    method: "PUT",
    headers: {
      "content-type": contentType,
      "content-length": String(body.byteLength),
      ...extraHeaders,
    },
    body: buf,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`R2 PUT ${key} failed: ${res.status} ${text.slice(0, 500)}`);
  }
  return { key, bytes: body.byteLength, etag: res.headers.get("etag") };
}

/** DELETE an object. Idempotent: R2 answers 204 whether or not the key existed. */
export async function r2Delete(cfg: R2Config, key: string): Promise<void> {
  const res = await client(cfg).fetch(r2ObjectUrl(cfg, key), { method: "DELETE" });
  if (!res.ok && res.status !== 404) {
    const text = await res.text().catch(() => "");
    throw new Error(`R2 DELETE ${key} failed: ${res.status} ${text.slice(0, 500)}`);
  }
}

/** HEAD an object; `null` when it does not exist. */
export async function r2Head(cfg: R2Config, key: string): Promise<{ bytes: number; etag: string | null } | null> {
  const res = await client(cfg).fetch(r2ObjectUrl(cfg, key), { method: "HEAD" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`R2 HEAD ${key} failed: ${res.status}`);
  return { bytes: Number(res.headers.get("content-length") ?? 0), etag: res.headers.get("etag") };
}
