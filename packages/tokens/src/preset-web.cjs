// =============================================================================
// TAILWIND PRESET (WEB) — CSS-variable themed, dual-theme.
// -----------------------------------------------------------------------------
// Web-only. Colours resolve to `var(--ms-<token>)`, and this preset injects the
// variable definitions via addBase:
//   :root          -> LIGHT values (the default; clinical surfaces stay here)
//   .theme-dark    -> DARK values (OPERATIONAL surfaces opt in by adding the
//                     class to a wrapper; clinical surfaces never do)
//
// This is how "operational-only dark" is enforced: dark is available, but only
// where a surface explicitly opts in. Clinical status tokens keep their meaning
// in both themes. Mobile keeps the baked `preset.cjs` (light) until the mobile
// theming pass wires NativeWind's own dark handling.
//
// Generated from the SAME semantic layer as preset.cjs — single source of truth.
// =============================================================================

const plugin = require("tailwindcss/plugin");
const { cssVars, varColors } = require("./theme.cjs");
const { fonts } = require("./fonts.cjs");

const colors = {
  transparent: "transparent",
  current: "currentColor",
  ...varColors(),
};

/** @type {import('tailwindcss').Config} */
const preset = {
  theme: {
    colors, // override, not extend — default palette stays unavailable
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
    },
    extend: {},
  },
  plugins: [
    plugin(function ({ addBase }) {
      addBase({
        ":root": cssVars("light"),
        ".theme-dark": cssVars("dark"),
      });
    }),
  ],
};

module.exports = preset;
