// =============================================================================
// CANONICAL SECURE EDGE FUNCTION HANDLER.
// -----------------------------------------------------------------------------
// Every sensitive write follows this exact pipeline, IN THIS ORDER:
//   1. Zod validation      — reject malformed input BEFORE anything else.
//   2. Auth check          — getUser() (revalidated JWT); no user => 401.
//   3. Role check          — caller holds the required role => else 403.
//   4. PII-safe logging    — structured logs that NEVER contain PHI/PII.
//   5. Audit write + op     — the audit row and the operation happen together
//                             (same DB transaction via an RPC) so the operation
//                             can never succeed without its audit row.
//
// The handler is dependency-injected: the Deno entrypoint wires real Supabase
// clients; tests wire fakes. That is what makes the pattern verifiable under
// Node AND genuinely reusable — no domain logic lives in here.
// =============================================================================

import { z } from "zod";

export type AuthedUser = { id: string };

export type Logger = (event: string, fields: Record<string, unknown>) => void;

/** The auth surface the handler needs — a thin slice of the Supabase client. */
export type AuthProvider = {
  getUser: (
    token: string,
  ) => Promise<{ user: AuthedUser | null; error: unknown }>;
  /** Role keys for the user, from the DB (SECURITY DEFINER helper). */
  getRoleKeys: (userId: string) => Promise<string[]>;
};

/**
 * Runs `operation` transactionally WITH its audit row. Implementations MUST
 * write the audit row and perform the operation in the same transaction (e.g. a
 * single Postgres function / RPC), so a successful op always has an audit row.
 */
export type TransactionalOp<TInput, TResult> = (args: {
  user: AuthedUser;
  input: TInput;
}) => Promise<TResult>;

export type SecureHandlerConfig<TSchema extends z.ZodTypeAny, TResult> = {
  schema: TSchema;
  /** Required role key; caller must hold it (admins are allowed through). */
  requiredRole: string;
  /** A short action name for audit/log lines (no PHI). */
  action: string;
  operation: TransactionalOp<z.infer<TSchema>, TResult>;
  deps: { auth: AuthProvider; log: Logger };
};

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function bearer(req: Request): string | null {
  const h = req.headers.get("authorization") ?? "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1]! : null;
}

export function createSecureHandler<TSchema extends z.ZodTypeAny, TResult>(
  cfg: SecureHandlerConfig<TSchema, TResult>,
): (req: Request) => Promise<Response> {
  const { schema, requiredRole, action, operation, deps } = cfg;

  return async function handler(req: Request): Promise<Response> {
    // --- 1. Validation (before any auth work) --------------------------------
    let raw: unknown;
    try {
      raw = await req.json();
    } catch {
      return json({ error: "invalid_request" }, 400);
    }
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      // Generic message — do NOT leak Zod issues / schema internals to callers.
      deps.log("validation_failed", {
        action,
        issues: parsed.error.issues.length,
      });
      return json({ error: "invalid_request" }, 400);
    }

    // --- 2. Auth -------------------------------------------------------------
    const token = bearer(req);
    if (!token) return json({ error: "unauthorized" }, 401);
    const { user, error } = await deps.auth.getUser(token);
    if (error || !user) return json({ error: "unauthorized" }, 401);

    // --- 3. Role -------------------------------------------------------------
    const roleKeys = await deps.auth.getRoleKeys(user.id);
    const authorized =
      roleKeys.includes(requiredRole) || roleKeys.includes("admin");
    if (!authorized) {
      // Log the denial WITHOUT PHI: actor id + action only.
      deps.log("authz_denied", { action, actor: user.id });
      return json({ error: "forbidden" }, 403);
    }

    // --- 4. PII-safe logging -------------------------------------------------
    // Only non-PII identifiers are logged. The validated payload is NEVER
    // logged (it may contain PHI). This is the single log line for the op.
    deps.log("operation_start", { action, actor: user.id });

    // --- 5. Audit write + operation (transactional together) -----------------
    try {
      const result = await operation({ user, input: parsed.data });
      deps.log("operation_ok", { action, actor: user.id });
      return json({ data: result }, 200);
    } catch {
      deps.log("operation_error", { action, actor: user.id });
      return json({ error: "operation_failed" }, 500);
    }
  };
}
