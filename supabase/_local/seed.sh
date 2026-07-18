#!/usr/bin/env bash
set -euo pipefail
export PGHOST="${PGHOST:-/tmp}" PGPORT="${PGPORT:-5433}" PGUSER="${PGUSER:-postgres}"
DB="${1:?usage: seed.sh <db>}"
ENVNAME="${MEDSYNC_ENV:-development}"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
# The GUC carries the environment into the SQL guard.
psql -q -d "$DB" -v ON_ERROR_STOP=1 \
  -c "set app.environment = '${ENVNAME}';" \
  -f "$ROOT/supabase/seed.sql"
