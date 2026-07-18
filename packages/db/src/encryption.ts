// =============================================================================
// APP-LEVEL PHI ENCRYPTION — AES-256-GCM.
// -----------------------------------------------------------------------------
// Supabase deprecated pgcrypto transparent column encryption (2025); app-level
// AEAD is the correct approach. Designated PHI columns are encrypted here before
// they reach the database and decrypted after they are read.
//
// GUARANTEES:
//   * Fresh random 96-bit IV per encryption call (never reused — IV reuse in
//     GCM is catastrophic). Enforced structurally: randomBytes on every call.
//   * The GCM auth tag is stored and verified on decrypt; a tampered ciphertext
//     (or tag, or IV) makes decrypt THROW, never returns garbage.
//   * Key rotation without data loss: every ciphertext is tagged with a short
//     key id; decrypt selects the matching key from the current key plus any
//     retired keys in PHI_ENCRYPTION_KEY_PREVIOUS. Rotate by moving the old key
//     into PREVIOUS and setting a new current key; old rows still decrypt.
//
// Bundle format (all base64url, '.'-joined): `<keyId>.<iv>.<ciphertext>.<tag>`.
// =============================================================================

import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

const ALGO = "aes-256-gcm";
const IV_BYTES = 12; // 96-bit IV, the GCM standard
const KEY_BYTES = 32; // AES-256
const KEY_ID_LEN = 8; // hex chars of the key fingerprint

type KeyEntry = { id: string; key: Buffer };

function keyId(key: Buffer): string {
  return createHash("sha256").update(key).digest("hex").slice(0, KEY_ID_LEN);
}

function decodeKey(b64: string): Buffer {
  const key = Buffer.from(b64.trim(), "base64");
  if (key.length !== KEY_BYTES) {
    throw new Error(
      `PHI encryption key must be ${KEY_BYTES} bytes (base64). Got ${key.length}.`,
    );
  }
  return key;
}

/** Current key (for encryption) + all keys (current + retired, for decryption). */
function loadKeys(): { current: KeyEntry; all: Map<string, KeyEntry> } {
  const currentB64 = process.env.PHI_ENCRYPTION_KEY;
  if (!currentB64) throw new Error("Missing PHI_ENCRYPTION_KEY");
  const currentKey = decodeKey(currentB64);
  const current: KeyEntry = { id: keyId(currentKey), key: currentKey };

  const all = new Map<string, KeyEntry>();
  all.set(current.id, current);

  const prev = process.env.PHI_ENCRYPTION_KEY_PREVIOUS;
  if (prev) {
    for (const part of prev.split(",")) {
      if (!part.trim()) continue;
      const k = decodeKey(part);
      const id = keyId(k);
      if (!all.has(id)) all.set(id, { id, key: k });
    }
  }
  return { current, all };
}

const b64u = (b: Buffer) => b.toString("base64url");
const fromB64u = (s: string) => Buffer.from(s, "base64url");

/** Encrypt a UTF-8 plaintext. Returns an opaque, storable bundle string. */
export function encryptPhi(plaintext: string): string {
  const { current } = loadKeys();
  const iv = randomBytes(IV_BYTES); // fresh per call — never reused
  const cipher = createCipheriv(ALGO, current.key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return [current.id, b64u(iv), b64u(ciphertext), b64u(tag)].join(".");
}

/** Decrypt a bundle. THROWS if the key is unknown or the data was tampered. */
export function decryptPhi(bundle: string): string {
  const parts = bundle.split(".");
  if (parts.length !== 4) throw new Error("Malformed PHI ciphertext bundle");
  const [id, ivB64, ctB64, tagB64] = parts as [string, string, string, string];

  const { all } = loadKeys();
  const entry = all.get(id);
  if (!entry) {
    throw new Error(
      `No PHI key matches ciphertext key id ${id} (rotation gap?)`,
    );
  }

  const iv = fromB64u(ivB64);
  const tag = fromB64u(tagB64);
  const decipher = createDecipheriv(ALGO, entry.key, iv);
  decipher.setAuthTag(tag); // verified in final(); mismatch => throw
  return Buffer.concat([
    decipher.update(fromB64u(ctB64)),
    decipher.final(),
  ]).toString("utf8");
}

/** Which key id would encrypt right now — used by rotation tooling/tests. */
export function currentKeyId(): string {
  return loadKeys().current.id;
}

// re-export so timingSafeEqual is available to callers doing constant-time
// comparisons of decrypted secrets (kept here to centralise crypto imports).
export { timingSafeEqual };
