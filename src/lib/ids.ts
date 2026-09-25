import { randomBytes } from "node:crypto";

const ALPHABET = "0123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"; // no l/o/I/O ambiguity

/** URL-safe, unguessable id (default 21 chars ≈ 122 bits). */
export function newId(size = 21): string {
  const bytes = randomBytes(size);
  let out = "";
  for (let i = 0; i < size; i++) out += ALPHABET[bytes[i] % ALPHABET.length];
  return out;
}

/** Longer secret token for anonymous assessment ownership. */
export function newToken(): string {
  return newId(40);
}
