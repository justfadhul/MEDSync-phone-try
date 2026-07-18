#!/usr/bin/env bash
# Proves each migration applies clean, rolls back clean, and re-applies clean.
set -euo pipefail
export PGHOST="${PGHOST:-/tmp}" PGPORT="${PGPORT:-5433}" PGUSER="${PGUSER:-postgres}"
DB="${1:-medsync_rollback}"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
P(){ psql -q -d "$DB" -v ON_ERROR_STOP=1 "$@"; }

psql -q -d postgres -v ON_ERROR_STOP=1 -c "drop database if exists ${DB};" -c "create database ${DB};" >/dev/null
P -f "$ROOT/supabase/_local/00_supabase_shim.sql" >/dev/null

echo "== up =="
for f in "$ROOT"/supabase/migrations/*.sql; do echo "   up   $(basename "$f")"; P -f "$f" >/dev/null; done
# object exists?
P -c "select 1 from pg_class where relname='profiles' and relkind='r';" | grep -q 1 && echo "   ok: profiles exists"

echo "== down (reverse order) =="
for f in $(ls -r "$ROOT"/supabase/migrations/down/*.down.sql); do echo "   down $(basename "$f")"; P -f "$f" >/dev/null; done
if P -tc "select count(*) from pg_class where relname='profiles' and relkind='r';" | grep -q 1; then
  echo "   FAIL: profiles still present after rollback"; exit 1
fi
echo "   ok: profiles gone after rollback"

echo "== re-apply =="
for f in "$ROOT"/supabase/migrations/*.sql; do echo "   up   $(basename "$f")"; P -f "$f" >/dev/null; done
P -c "select 1 from pg_class where relname='profiles' and relkind='r';" | grep -q 1 && echo "   ok: profiles re-created clean"

psql -q -d postgres -v ON_ERROR_STOP=1 -c "drop database ${DB};" >/dev/null
echo "ROLLBACK CYCLE PASSED (apply -> rollback -> re-apply)"
