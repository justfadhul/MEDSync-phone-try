-- =============================================================================
-- LOCAL SUPABASE SHIM — for verifying RLS against local Postgres ONLY.
-- Reproduces the pieces of the Supabase platform that RLS policies depend on:
-- the auth schema, auth.uid()/auth.jwt(), and the anon/authenticated/
-- service_role roles. NOT a migration; never applied to the real project
-- (Supabase provides all of this natively).
-- =============================================================================

-- Platform roles (Supabase-provided in the real project).
do $$ begin
  if not exists (select from pg_roles where rolname='anon') then create role anon nologin noinherit; end if;
  if not exists (select from pg_roles where rolname='authenticated') then create role authenticated nologin noinherit; end if;
  if not exists (select from pg_roles where rolname='service_role') then create role service_role nologin noinherit bypassrls; end if;
  if not exists (select from pg_roles where rolname='authenticator') then create role authenticator noinherit login password 'authenticator'; end if;
end $$;
grant anon, authenticated, service_role to authenticator;

create schema if not exists auth;

-- auth.uid() reads the 'sub' claim from the request JWT claims GUC, exactly as
-- Supabase does. Robust to the GUC being unset OR an empty string (e.g. after
-- reset request.jwt.claims), returning null then rather than throwing on ''::jsonb.
create or replace function auth.uid() returns uuid language sql stable as $$
  select (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')::uuid;
$$;

create or replace function auth.jwt() returns jsonb language sql stable as $$
  select coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb, '{}'::jsonb);
$$;

grant usage on schema auth to anon, authenticated, service_role;

-- Minimal auth.users so FKs resolve locally (Supabase provides this table).
create table if not exists auth.users (
  id uuid primary key default gen_random_uuid(),
  email text unique
);
grant select on auth.users to authenticated, service_role;
