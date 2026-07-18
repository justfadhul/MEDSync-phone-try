-- Down for 0001_profiles. Drops in reverse dependency order. (Migrations are
-- forward-only in production; this proves reversibility for verification.)
drop view if exists public.profiles_active;
drop table if exists public.profiles cascade;  -- policies + trigger drop with it
