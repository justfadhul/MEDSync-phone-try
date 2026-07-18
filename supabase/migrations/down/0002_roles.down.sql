drop function if exists auth.mfa_satisfied();
drop function if exists auth.has_aal2();
drop function if exists auth.user_requires_mfa();
drop function if exists auth.is_admin();
drop function if exists auth.user_role_keys();
drop table if exists public.user_roles cascade;
drop table if exists public.roles cascade;
