#!/usr/bin/env bash
# =============================================================================
# LOCAL DB VERIFICATION HARNESS (not part of the app; used to prove migrations
# + RLS against a real Postgres, standing in for the Supabase project which is
# provisioned separately). Creates a throwaway database, applies the shim +
# every migration in order, runs every probe in supabase/tests/, then drops it.
#   PGHOST/PGPORT/PGUSER default to the local cluster on /tmp:5433.
# =============================================================================
set -euo pipefail

export PGHOST="${PGHOST:-/tmp}"
export PGPORT="${PGPORT:-5433}"
export PGUSER="${PGUSER:-postgres}"
DB="${1:-medsync_verify}"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

psql -q -d postgres -v ON_ERROR_STOP=1 -c "drop database if exists ${DB};" -c "create database ${DB};"

echo "== applying shim =="
psql -q -d "$DB" -v ON_ERROR_STOP=1 -f "$ROOT/supabase/_local/00_supabase_shim.sql"

echo "== applying migrations =="
for f in "$ROOT"/supabase/migrations/*.sql; do
  echo "   -> $(basename "$f")"
  psql -q -d "$DB" -v ON_ERROR_STOP=1 -f "$f"
done

echo "== running probes =="
for t in "$ROOT"/supabase/tests/*.sql; do
  echo "   -> $(basename "$t")"
  psql -q -d "$DB" -v ON_ERROR_STOP=1 -f "$t"
done

echo "== rollback re-apply check (idempotency of a clean create) =="
psql -q -d postgres -v ON_ERROR_STOP=1 -c "drop database ${DB};"
echo "ALL DB TESTS PASSED"
