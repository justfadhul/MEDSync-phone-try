// =============================================================================
// TAILWIND PRESET — generated from the token layer. Consumed by BOTH apps.
// -----------------------------------------------------------------------------
//   web:    apps/web/tailwind.config.ts  -> presets: [medsyncPreset]
//   mobile: apps/mobile/tailwind.config.js -> presets: [nativewind/preset,
//                                                        medsyncPreset]
// `colors` is set (NOT extended) to ONLY the semantic groups, so the default
// Tailwind palette (gray/emerald/red/...) is unavailable in components. This is
// how "no raw palette / primitive in components" is enforced at the class level;
// the raw-hex ESLint rule enforces it at the literal level.
//
// Only the ACTIVE (light) theme is wired. `dark` exists in the token layer but
// is not emitted here while DARK_MODE_ENABLED is false (see flags.cjs).
// =============================================================================

const { themeColors, ACTIVE_THEME } = require("./theme.cjs");
const { fonts } = require("./fonts.cjs");

const colors = {
  transparent: "transparent",
  current: "currentColor",
  ...themeColors(ACTIVE_THEME),
};

/** @type {import('tailwindcss').Config} */
const preset = {
  theme: {
    // Override, not extend: default palette is intentionally removed.
    colors,
    // 4px grid is Tailwind's default spacing scale (1 = 4px). Radii per §3.2.
    borderRadius: {
      none: "0",
      sm: "4px",
      DEFAULT: "6px",
      md: "8px",
      lg: "12px",
      full: "9999px",
    },
    fontFamily: {
      sans: fonts.sans,
      mono: fonts.mono,
      display: fonts.display,
    },
    extend: {},
  },
};

module.exports = preset;
