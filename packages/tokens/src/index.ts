// =============================================================================
// @medsync/tokens — public API for APP CODE (TypeScript).
// -----------------------------------------------------------------------------
// Exposes SEMANTIC tokens, theme resolution, fonts and flags. It deliberately
// does NOT export primitives: there is no import path from app code to a raw
// value. Components should prefer Tailwind semantic classes; this API is for
// the rare case code needs a token value (e.g. a chart, a native prop).
//
// The runtime source of truth is the .cjs layer (also consumed by the Tailwind
// presets in both apps), so web and mobile resolve identical values.
// =============================================================================

import { resolveTheme, themeColors, light, dark, active } from "./theme.cjs";
import { fonts } from "./fonts.cjs";
import { DARK_MODE_ENABLED, ACTIVE_THEME } from "./flags.cjs";
import { semantic } from "./semantic.cjs";

export type ThemeMode = "light" | "dark";

/** Union of every semantic token name, e.g. "surface-primary". */
export type SemanticTokenName = keyof typeof semantic;

/** Resolved active-theme token map: { "surface-primary": "#FFFFFF", ... }. */
export const tokens: Record<SemanticTokenName, string> = active as Record<
  SemanticTokenName,
  string
>;

export {
  resolveTheme,
  themeColors,
  light,
  dark,
  fonts,
  DARK_MODE_ENABLED,
  ACTIVE_THEME,
};
