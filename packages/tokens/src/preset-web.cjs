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
const { primitives } = require("./primitives.cjs");

// Glass material variables — NOT colours (blur/shadow strings), so they bypass
// the colour map and are injected straight into :root. Consumed only by the
// .material-glass-* utilities in globals.css.
const g = primitives.glass;
const glassVars = {
  "--ms-glass-nav-bg": g.navBg,
  "--ms-glass-nav-border": g.navBorder,
  "--ms-glass-nav-shadow": g.navShadow,
  "--ms-glass-panel-bg": g.panelBg,
  "--ms-glass-panel-border": g.panelBorder,
  "--ms-glass-panel-shadow": g.panelShadow,
  "--ms-glass-blur": g.blur,
  "--ms-glass-blur-strong": g.blurStrong,
};

// Neumorphic elevation (shadows, not colours) — consumed by .neu-* utilities.
const e = primitives.elevation;
const neuVars = {
  "--ms-neu-soft": e.soft,
  "--ms-neu-float": e.float,
  "--ms-neu-btn": e.btn,
  "--ms-neu-inset": e.inset,
};

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
      display: fonts.display,
    },
    extend: {},
  },
  plugins: [
    plugin(function ({ addBase }) {
      addBase({
        ":root": { ...cssVars("light"), ...glassVars, ...neuVars },
        ".theme-dark": cssVars("dark"),
      });
    }),
  ],
};

module.exports = preset;
