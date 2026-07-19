// =============================================================================
// SEMANTIC TOKENS — meaning-bearing. Components reference ONLY these.
// -----------------------------------------------------------------------------
// Every token defines BOTH `light` and `dark` so dark is structurally complete.
// Only `light` is wired to the apps (see flags.cjs / theme.cjs).
//
// SAFETY INVARIANTS (enforced by tests in tokens.test.mjs):
//   - `status.critical` is the ONLY semantic token that resolves to red-600.
//   - No non-emergency token (feedback.error/warning, action.destructive)
//     resolves to any red primitive. Non-emergency errors use amber/neutral.
// =============================================================================

const { primitives: p } = require("./primitives.cjs");

// Each entry: [tokenPath] -> { light, dark }
const semantic = {
  // --- Surfaces (backgrounds) ------------------------------------------------
  "surface-page": { light: p.gray[50], dark: p.gray[950] },
  "surface-primary": { light: p.white, dark: p.gray[900] },
  "surface-secondary": { light: p.gray[50], dark: p.gray[800] },
  "surface-tertiary": { light: p.gray[100], dark: p.gray[700] },
  "surface-raised": { light: p.white, dark: p.gray[800] },
  "surface-inverse": { light: p.gray[900], dark: p.gray[50] },

  // --- Content (text / foreground / icons) -----------------------------------
  "content-primary": { light: p.gray[900], dark: p.gray[50] },
  "content-secondary": { light: p.gray[600], dark: p.gray[300] },
  "content-tertiary": { light: p.gray[500], dark: p.gray[400] },
  "content-disabled": { light: p.gray[400], dark: p.gray[600] },
  "content-inverse": { light: p.white, dark: p.gray[900] },
  "content-on-brand": { light: p.white, dark: p.white },
  "content-link": { light: p.blue[600], dark: p.blue[400] },

  // --- Lines (borders / dividers) --------------------------------------------
  "line-subtle": { light: p.gray[200], dark: p.gray[700] },
  "line-default": { light: p.gray[300], dark: p.gray[600] },
  "line-strong": { light: p.gray[400], dark: p.gray[500] },

  // --- Brand / interactive (blue) --------------------------------------------
  "brand-primary": { light: p.blue[600], dark: p.blue[500] },
  "brand-primary-hover": { light: p.blue[700], dark: p.blue[400] },
  "brand-primary-active": { light: p.blue[800], dark: p.blue[300] },
  "brand-cta": { light: p.blue[900], dark: p.blue[800] }, // dark CTA background
  "brand-subtle": { light: p.blue[50], dark: p.blue[950] },

  // --- Focus -----------------------------------------------------------------
  "focus-ring": { light: p.blue[600], dark: p.blue[400] },

  // --- Clinical status (THE SAFETY CHANNEL) ----------------------------------
  // status-critical is the sole path to red. Do not add other red tokens.
  "status-stable": { light: p.green[600], dark: p.green[600] },
  "status-stable-surface": { light: p.green[50], dark: p.gray[800] },
  "status-critical": { light: p.red[600], dark: p.red[600] },
  "status-critical-strong": { light: p.red[700], dark: p.red[700] },
  "status-critical-surface": { light: p.red[50], dark: p.gray[800] },
  "status-caution": { light: p.amber[500], dark: p.amber[400] },
  "status-caution-surface": { light: p.amber[50], dark: p.gray[800] },
  "status-admitted": { light: p.blue[600], dark: p.blue[500] },
  "status-admitted-surface": { light: p.blue[50], dark: p.gray[800] },

  // --- Feedback (NON-clinical UI states) — MUST NOT use red ------------------
  // Form validation errors and warnings use amber/neutral so red keeps its
  // single clinical meaning (design system §3.1, a safety property).
  "feedback-error": { light: p.amber[700], dark: p.amber[400] },
  "feedback-error-surface": { light: p.amber[50], dark: p.gray[800] },
  "feedback-warning": { light: p.amber[500], dark: p.amber[400] },
  "feedback-warning-surface": { light: p.amber[50], dark: p.gray[800] },
  "feedback-success": { light: p.green[600], dark: p.green[600] },
  "feedback-success-surface": { light: p.green[50], dark: p.gray[800] },
  "feedback-info": { light: p.blue[600], dark: p.blue[500] },

  // --- Action intents --------------------------------------------------------
  // Destructive actions use a NEUTRAL treatment, never red (red = emergency).
  "action-destructive": { light: p.gray[700], dark: p.gray[300] },
  "action-destructive-hover": { light: p.gray[800], dark: p.gray[200] },
};

module.exports = { semantic };
