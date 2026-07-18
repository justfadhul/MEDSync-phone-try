import { test, before } from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";

// Two 32-byte keys, base64. Set BEFORE importing the module's functions (they
// read env lazily per call, so setting here is sufficient).
const KEY_V2 = randomBytes(32).toString("base64");
const KEY_V1 = randomBytes(32).toString("base64");

let encryptPhi, decryptPhi, currentKeyId;
before(async () => {
  process.env.PHI_ENCRYPTION_KEY = KEY_V2;
  process.env.PHI_ENCRYPTION_KEY_PREVIOUS = KEY_V1;
  ({ encryptPhi, decryptPhi, currentKeyId } = await import("./encryption.ts"));
});

test("round trip: decrypt(encrypt(x)) === x", () => {
  const pt = "Patient: John D., BP 180/120, on warfarin";
  assert.equal(decryptPhi(encryptPhi(pt)), pt);
});

test("round trip: unicode + empty", () => {
  assert.equal(decryptPhi(encryptPhi("")), "");
  assert.equal(decryptPhi(encryptPhi("Ωμέγα — 中文 — 🩺")), "Ωμέγα — 中文 — 🩺");
});

test("IV is unique per call: same plaintext -> different ciphertext", () => {
  const pt = "same plaintext";
  const a = encryptPhi(pt);
  const b = encryptPhi(pt);
  assert.notEqual(a, b, "ciphertexts must differ (fresh IV each call)");
  const ivA = a.split(".")[1];
  const ivB = b.split(".")[1];
  assert.notEqual(ivA, ivB, "IVs must differ");
  // both still decrypt correctly
  assert.equal(decryptPhi(a), pt);
  assert.equal(decryptPhi(b), pt);
});

test("IV uniqueness holds across many calls (no collisions in 1000)", () => {
  const ivs = new Set();
  for (let i = 0; i < 1000; i++) ivs.add(encryptPhi("x").split(".")[1]);
  assert.equal(ivs.size, 1000);
});

test("tampered CIPHERTEXT throws (auth tag verification)", () => {
  const parts = encryptPhi("secret").split(".");
  // flip a byte in the ciphertext segment
  const ctBuf = Buffer.from(parts[2], "base64url");
  ctBuf[0] ^= 0xff;
  parts[2] = ctBuf.toString("base64url");
  assert.throws(() => decryptPhi(parts.join(".")));
});

test("tampered TAG throws", () => {
  const parts = encryptPhi("secret").split(".");
  const tagBuf = Buffer.from(parts[3], "base64url");
  tagBuf[0] ^= 0xff;
  parts[3] = tagBuf.toString("base64url");
  assert.throws(() => decryptPhi(parts.join(".")));
});

test("tampered IV throws", () => {
  const parts = encryptPhi("secret").split(".");
  const ivBuf = Buffer.from(parts[1], "base64url");
  ivBuf[0] ^= 0xff;
  parts[1] = ivBuf.toString("base64url");
  assert.throws(() => decryptPhi(parts.join(".")));
});

test("rotation: ciphertext from a retired key still decrypts", async () => {
  // encrypt under V1 as the current key...
  process.env.PHI_ENCRYPTION_KEY = KEY_V1;
  delete process.env.PHI_ENCRYPTION_KEY_PREVIOUS;
  const mod = await import("./encryption.ts?rot=1");
  const oldCipher = mod.encryptPhi("historical PHI");
  const oldId = oldCipher.split(".")[0];
  // ...now rotate: V2 current, V1 retired
  process.env.PHI_ENCRYPTION_KEY = KEY_V2;
  process.env.PHI_ENCRYPTION_KEY_PREVIOUS = KEY_V1;
  const mod2 = await import("./encryption.ts?rot=2");
  assert.notEqual(mod2.currentKeyId(), oldId, "current key rotated");
  assert.equal(mod2.decryptPhi(oldCipher), "historical PHI", "old row still decrypts");
});

test("unknown key id throws (rotation gap)", () => {
  const c = encryptPhi("x");
  const parts = c.split(".");
  parts[0] = "deadbeef";
  assert.throws(() => decryptPhi(parts.join(".")), /No PHI key matches/);
});
