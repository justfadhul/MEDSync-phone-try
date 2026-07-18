// @medsync/db — Drizzle schema (source of TS types) + PHI encryption.
export * as schema from "./schema/index";
export type { Profile, NewProfile } from "./schema/profiles";
export { encryptPhi, decryptPhi, currentKeyId } from "./encryption";
