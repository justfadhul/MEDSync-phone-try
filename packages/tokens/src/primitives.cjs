// =============================================================================
// PRIMITIVE TOKENS — raw values. THE ONLY FILE IN THE APP TREE THAT MAY HOLD HEX.
// -----------------------------------------------------------------------------
// Primitives are NEVER referenced by a component and are NOT exported from the
// package index. Components consume SEMANTIC tokens only (see semantic.cjs).
// Monochrome + blue. Red is reserved for clinical emergencies (see semantic).
// =============================================================================

const primitives = {
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",

  // Cool light canvas behind the neumorphic splash surface (see IMG_8295).
  canvas: "#E9EEF3",

  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
    950: "#030712",
  },

  // Brand: teal. Centred on the reference primary #427791 (=teal-600, AA on
  // white) with teal-800 as the dark CTA background. #60B1D6 (teal-400) is the
  // bright accent / gradient light-end, used on NON-text decoration only (it is
  // too light to carry white body text at AA). `gradFrom`/`gradTo` are the pill
  // button gradient, chosen so white text clears AA across the whole sweep.
  teal: {
    50: "#EEF4F7",
    100: "#D8E8EF",
    200: "#B4D2DF",
    300: "#8AC4DD",
    400: "#60B1D6",
    500: "#4E90AE",
    600: "#427791",
    700: "#386577",
    800: "#2E5362",
    900: "#26424B",
    950: "#172831",
    gradFrom: "#427791", // = teal-600; white text ≥4.9:1 across the whole sweep
    gradTo: "#386577",
  },

  // Clinical emergency ONLY. Deliberately minimal so red cannot creep into
  // non-emergency use. status-critical is the sole semantic path to red-600.
  red: {
    50: "#FEF2F2",
    600: "#DC2626",
    700: "#B91C1C",
  },

  // Caution / non-emergency errors / warnings.
  amber: {
    50: "#FFFBEB",
    400: "#FBBF24",
    500: "#F59E0B",
    600: "#D97706",
    700: "#B45309",
  },

  // Stable / success.
  green: {
    50: "#F0FDF4",
    600: "#16A34A",
    700: "#15803D",
  },

  // -------------------------------------------------------------------------
  // Categorical surface pastels — WAYFINDING ONLY, never a clinical signal.
  // Muted, decorative card tints + a matching icon/label accent. Deliberately
  // desaturated so they never read as the saturated clinical trio (red/green/
  // amber), which stays reserved for status. `tint`/`accent` are the light
  // values; `tintDark`/`accentDark` are tuned for operational dark surfaces
  // (translucent fill so the dark page shows through; brighter accent).
  // -------------------------------------------------------------------------
  pastel: {
    rose: {
      tint: "#F8DEDE", accent: "#C97B7B",
      tintDark: "rgba(201,123,123,0.18)", accentDark: "#E3A6A6",
    },
    peach: {
      tint: "#FBE7D2", accent: "#D2914E",
      tintDark: "rgba(210,145,78,0.18)", accentDark: "#E5B074",
    },
    lavender: {
      tint: "#E0DBF4", accent: "#7E70CE",
      tintDark: "rgba(126,112,206,0.22)", accentDark: "#A99CE6",
    },
    mint: {
      tint: "#D3EDE2", accent: "#489C80",
      tintDark: "rgba(72,156,128,0.18)", accentDark: "#6CC4A6",
    },
    coral: {
      tint: "#F8CFC4", accent: "#D9765F",
      tintDark: "rgba(217,118,95,0.18)", accentDark: "#EC9583",
    },
    sky: {
      tint: "#D8E7F6", accent: "#4D86BE",
      tintDark: "rgba(77,134,190,0.18)", accentDark: "#7FB0DC",
    },
  },

  // -------------------------------------------------------------------------
  // GLASS MATERIALS (marketing chrome only — nav + announcement + one hero
  // element). Conservative: backdrop-filter + rgba only, no SVG/WebGL. These
  // are injected as CSS variables and consumed by the .material-glass-*
  // utilities (globals.css), never inline. Solid fallbacks live in those
  // utilities via @supports / prefers-reduced-transparency.
  // -------------------------------------------------------------------------
  glass: {
    navBg: "rgba(249,250,251,0.88)", // ~surface-page, translucent. 0.88 (not lower) so secondary text on the nav clears WCAG AA (worst-case ~5.5:1) even when a dark element scrolls beneath it — contrast safety outranks the glass look (design-system §E).
    navBorder: "rgba(17,24,39,0.08)",
    navShadow: "0 1px 0 rgba(255,255,255,0.6) inset, 0 6px 20px -14px rgba(16,24,40,0.28)",
    panelBg: "rgba(255,255,255,0.60)",
    panelBorder: "rgba(255,255,255,0.55)",
    panelShadow: "0 1px 2px rgba(16,24,40,0.05), 0 20px 44px -26px rgba(16,24,40,0.38)",
    blur: "blur(12px) saturate(140%)",
    blurStrong: "blur(16px) saturate(140%)",
  },

  // -------------------------------------------------------------------------
  // NEUMORPHIC ELEVATION — soft shadows for the splash surface (IMG_8295).
  // Shadows, not palette colours (rgba ink/light only). Injected as CSS vars
  // and consumed by the .neu-* utilities in globals.css, never inline.
  // -------------------------------------------------------------------------
  elevation: {
    soft: "0 24px 60px -24px rgba(23,40,49,0.28), 0 4px 12px -6px rgba(23,40,49,0.10)",
    float: "0 10px 24px -8px rgba(23,40,49,0.26), 0 2px 4px rgba(23,40,49,0.10)",
    btn: "0 10px 22px -8px rgba(46,83,98,0.55), inset 0 1px 0 rgba(255,255,255,0.28)",
    inset: "inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(23,40,49,0.04)",
  },
};

module.exports = { primitives };
