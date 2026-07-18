// =============================================================================
// PRIMITIVE TOKENS — raw values. THE ONLY FILE IN THE APP TREE THAT MAY HOLD HEX.
// -----------------------------------------------------------------------------
// Primitives are NEVER referenced by a component and are NOT exported from the
// package index. Components consume SEMANTIC tokens only (see semantic.cjs).
// Monochrome + teal. Red is reserved for clinical emergencies (see semantic).
// =============================================================================

const primitives = {
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",

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

  // Brand: teal-600 primary, teal-900 dark CTA background.
  teal: {
    50: "#F0FDFA",
    100: "#CCFBF1",
    200: "#99F6E4",
    300: "#5EEAD4",
    400: "#2DD4BF",
    500: "#14B8A6",
    600: "#0D9488",
    700: "#0F766E",
    800: "#115E59",
    900: "#134E4A",
    950: "#042F2E",
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
};

module.exports = { primitives };
