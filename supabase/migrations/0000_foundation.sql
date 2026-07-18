-- =============================================================================
-- 0000_foundation — shared primitives every later migration depends on.
--   * uuid_generate_v7(): time-ordered UUID v7 primary keys (§5 conventions)
--   * set_updated_at():   shared BEFORE UPDATE trigger fn maintaining updated_at
-- No tables here, so no RLS. These are SECURITY-relevant utilities only.
-- =============================================================================

-- gen_random_uuid() lives in pgcrypto on some builds; ensure it is available.
create extension if not exists pgcrypto;

-- --- UUID v7 -----------------------------------------------------------------
-- 48-bit unix-ms time prefix + random tail; version nibble = 7, variant = 10.
-- Time-ordered (index locality) yet non-enumerable. Generated server-side only.
create or replace function public.uuid_generate_v7()
returns uuid
language plpgsql
volatile
as $$
declare
  ts_ms bigint := (extract(epoch from clock_timestamp()) * 1000)::bigint;
  uuid_bytes bytea := uuid_send(gen_random_uuid());
begin
  -- first 6 bytes: big-endian unix timestamp in milliseconds
  uuid_bytes := overlay(uuid_bytes placing substring(int8send(ts_ms) from 3 for 6) from 1 for 6);
  -- byte 6: keep low nibble, set high nibble to 0111 (version 7)
  uuid_bytes := set_byte(uuid_bytes, 6, (get_byte(uuid_bytes, 6) & 15) | 112);
  -- byte 8: keep low 6 bits, set top two bits to 10 (RFC 4122 variant)
  uuid_bytes := set_byte(uuid_bytes, 8, (get_byte(uuid_bytes, 8) & 63) | 128);
  return encode(uuid_bytes, 'hex')::uuid;
end
$$;

comment on function public.uuid_generate_v7() is
  'UUID v7 (time-ordered). Default for all primary keys. Clients never set id.';

-- --- updated_at touch trigger ------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  -- created_at / created_by are immutable after insert.
  new.created_at := old.created_at;
  new.created_by := old.created_by;
  return new;
end
$$;

comment on function public.set_updated_at() is
  'BEFORE UPDATE trigger: maintains updated_at, freezes created_at/created_by.';
