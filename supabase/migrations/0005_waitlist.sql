-- =============================================================================
-- 0005_waitlist — public marketing waitlist capture.
--   A single email address submitted from the public landing page. This is the
--   ONLY table an anonymous visitor may write to, and they may only INSERT —
--   never read, so the list cannot be enumerated. No PHI, no clinical data.
-- RLS enabled + forced. anon/authenticated may INSERT; only admins may SELECT.
-- =============================================================================

create table public.waitlist (
  id         uuid primary key default public.uuid_generate_v7(),
  email      text not null unique,
  source     text,                    -- e.g. 'landing' — where the signup came from
  created_at timestamptz not null default now()
);
comment on table public.waitlist is
  'Public landing-page waitlist. Anonymous INSERT only (no SELECT to anon), so '
  'the list is write-only from the outside and cannot be enumerated. Not PHI.';

-- Basic shape guard: a plausible email, trimmed and lowercased by the app.
alter table public.waitlist
  add constraint waitlist_email_shape check (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$');

alter table public.waitlist enable row level security;
alter table public.waitlist force  row level security;

-- INSERT: anyone (anon or signed-in) may add an email. No USING clause exists
-- for INSERT; the WITH CHECK keeps it to a non-empty address.
create policy waitlist_insert_public on public.waitlist
  for insert to anon, authenticated
  with check (char_length(email) > 3);

-- SELECT: admins only. Deliberately no policy for anon → the list is opaque
-- to the public (submitting does not let you read others' submissions).
create policy waitlist_select_admin on public.waitlist
  for select to authenticated
  using (public.is_admin());

-- Privilege grants (RLS still gates every row; grants only open the verb).
grant insert on public.waitlist to anon, authenticated;
grant select on public.waitlist to authenticated;
