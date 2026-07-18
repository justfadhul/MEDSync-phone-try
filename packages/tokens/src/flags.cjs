// =============================================================================
// THEME FLAGS
// =============================================================================

// Dark mode is not approved for MedSync clinical surfaces. Clinical status
// colour is a safety channel; enabling a second theme doubles the surface where
// a Critical indicator can render with wrong contrast or wrong perceptual
// severity. Enabling this flag requires contrast verification of all clinical
// status tokens against WCAG AA, plus written CSO sign-off. Do not enable it to
// "see how it looks."
const DARK_MODE_ENABLED = false;

// The active theme is derived from the flag. Light ships; dark is defined in the
// token layer (structurally complete) but never wired while the flag is off.
const ACTIVE_THEME = DARK_MODE_ENABLED ? "dark" : "light";

module.exports = { DARK_MODE_ENABLED, ACTIVE_THEME };
