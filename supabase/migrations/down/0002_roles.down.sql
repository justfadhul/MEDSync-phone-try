-- Drop tables first (their policies depend on the helper functions), then fns.
drop table if exists public.user_roles cascade;
drop table if exists public.roles cascade;
drop function if exists public.mfa_satisfied();
drop function if exists public.has_aal2();
drop function if exists public.user_requires_mfa();
drop function if exists public.is_admin();
drop function if exists public.user_role_keys();
