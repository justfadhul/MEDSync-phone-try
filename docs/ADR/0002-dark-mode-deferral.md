# ADR 0002 — Dark mode is defined but deliberately disabled

**Status:** Accepted (Gate 0.2)

## Context

Clinical status colour (Stable/Critical/Caution/Admitted) is a safety channel.
A second theme doubles the surface where a Critical indicator could render with
wrong contrast or wrong perceptual severity.

## Decision

Both `light` and `dark` semantic theme maps exist in `packages/tokens` (dark is
structurally complete), but only `light` is wired. `DARK_MODE_ENABLED = false`.
Enabling requires WCAG-AA contrast verification of all clinical status tokens
plus written CSO sign-off.

## Consequences

- Ships one verified theme; no unreviewed clinical colour rendering.
- Dark can be enabled later without re-architecting the token layer.
  − Contributors cannot "just turn on" dark mode.
