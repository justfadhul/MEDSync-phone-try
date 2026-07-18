# ADR 0003 — App-level AES-256-GCM over pgcrypto TCE

**Status:** Accepted (Gate 0.5)

## Context

Designated PHI columns must be encrypted. Supabase deprecated pgcrypto
transparent column encryption (2025).

## Decision

Encrypt/decrypt PHI in the application layer (`packages/db/encryption.ts`) with
AES-256-GCM: fresh 96-bit IV per call, stored+verified auth tag, key-id-tagged
ciphertext bundles enabling key rotation via `PHI_ENCRYPTION_KEY_PREVIOUS`.

## Consequences

- AEAD (confidentiality + integrity); tampering throws on decrypt.
- Rotation without data loss; keys live in env, never in the repo.
  − The application, not the database, owns the plaintext boundary; encrypted
  columns are opaque to SQL (no server-side search on them).
