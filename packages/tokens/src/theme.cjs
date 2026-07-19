// =============================================================================
// THEME RESOLUTION — resolves semantic tokens for a given mode.
// -----------------------------------------------------------------------------
// Single source consumed by BOTH the Tailwind preset (web + mobile) and app
// code, so web and mobile resolve the same semantic token to the same value.
// =============================================================================

const { semantic } = require("./semantic.cjs");
const { ACTIVE_THEME } = require("./flags.cjs");

/** Flat map: { "surface-primary": "#FFFFFF", ... } for the given mode. */
function resolveTheme(mode) {
  const out = {};
  for (const [name, entry] of Object.entries(semantic)) {
    out[name] = entry[mode];
  }
  return out;
}

/**
 * Nested colour object for Tailwind (`colors.surface.primary` -> class
 * `surface-primary`). Splits each token name on its first hyphen into
 * group + key, so e.g. "status-critical-surface" -> status["critical-surface"].
 */
function themeColors(mode) {
  const flat = resolveTheme(mode);
  const nested = {};
  for (const [name, value] of Object.entries(flat)) {
    const i = name.indexOf("-");
    const group = name.slice(0, i);
    const key = name.slice(i + 1);
    (nested[group] ??= {})[key] = value;
  }
  return nested;
}

/**
 * CSS custom properties for a mode: { "--ms-surface-primary": "#FFFFFF", ... }.
 * Used by the web preset to theme via variables (so one class set serves both
 * light and dark). `--ms-<group>-<key>` reconstructs the token name exactly.
 */
function cssVars(mode) {
  const flat = resolveTheme(mode);
  const out = {};
  for (const [name, value] of Object.entries(flat)) {
    out[`--ms-${name}`] = value;
  }
  return out;
}

/** Nested colour groups whose values are `var(--ms-<token>)` references. */
function varColors() {
  const nested = themeColors("light"); // structure only; values replaced below
  const out = {};
  for (const group of Object.keys(nested)) {
    out[group] = {};
    for (const key of Object.keys(nested[group])) {
      out[group][key] = `var(--ms-${group}-${key})`;
    }
  }
  return out;
}

const light = resolveTheme("light");
const dark = resolveTheme("dark");

module.exports = {
  resolveTheme,
  themeColors,
  cssVars,
  varColors,
  light,
  dark,
  active: resolveTheme(ACTIVE_THEME),
  ACTIVE_THEME,
};
