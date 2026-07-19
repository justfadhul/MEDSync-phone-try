// =============================================================================
// THEME FLAGS
// =============================================================================
//
// DARK MODE POLICY (CSO decision): dark is enabled for OPERATIONAL surfaces
// (analytics, admin, audit) and remains DISABLED for CLINICAL surfaces.
//
// Why the split: clinical status colour is a safety channel. A second theme
// doubles the surface where a Critical indicator can render with wrong contrast
// or wrong perceptual severity, so clinical screens ship light until all
// clinical status tokens are contrast-verified against WCAG AA with written CSO
// sign-off. Operational screens carry no life-critical status colour, so dark is
// allowed there today.
//
// HOW IT IS ENFORCED: the web preset (preset-web.cjs) defines LIGHT tokens on
// :root and DARK tokens under `.theme-dark`. Dark is opt-in per surface — an
// operational surface wraps its root in `.theme-dark`; a clinical surface never
// does, so it can only ever render light. There is no global dark toggle on
// clinical routes to get wrong.

// Mobile (baked preset.cjs) still ships light only; DARK_MODE_ENABLED drives its
// ACTIVE_THEME. The mobile theming pass will wire NativeWind's own dark handling
// under the same operational-only rule.
const DARK_MODE_ENABLED = false;

// Operational (non-clinical) web surfaces may opt into dark via `.theme-dark`.
const OPERATIONAL_DARK_ENABLED = true;
// Clinical web/mobile surfaces stay light pending WCAG-AA contrast + CSO sign-off.
const CLINICAL_DARK_ENABLED = false;

// The active baked theme (mobile). Light ships; dark is structurally complete in
// the token layer but not wired into the baked preset while the flag is off.
const ACTIVE_THEME = DARK_MODE_ENABLED ? "dark" : "light";

module.exports = {
  DARK_MODE_ENABLED,
  OPERATIONAL_DARK_ENABLED,
  CLINICAL_DARK_ENABLED,
  ACTIVE_THEME,
};
