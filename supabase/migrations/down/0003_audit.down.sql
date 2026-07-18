drop trigger if exists user_roles_audit on public.user_roles;
drop trigger if exists roles_audit on public.roles;
drop trigger if exists profiles_audit on public.profiles;
drop table if exists audit.audit_log cascade;
drop function if exists audit.log_change();
drop function if exists audit.prevent_mutation();
drop schema if exists audit cascade;
