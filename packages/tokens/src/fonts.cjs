// =============================================================================
// FONT TOKENS — swappable from THIS FILE ONLY.
// -----------------------------------------------------------------------------
// Neue Haas Grotesk licensing for app bundling is unresolved (known open
// issue). The family is defined here so it can be swapped in one place without
// touching any component. Do not hardcode font names in components.
// =============================================================================

const fonts = {
  // Primary UI family: Poppins (the brand typeface — see IMG_8297). Self-hosted
  // by next/font on web via the --font-poppins CSS variable (app/layout.tsx);
  // the literal "Poppins" and system stack are fallbacks (mobile / no-var).
  sans: [
    "var(--font-poppins)",
    "Poppins",
    "Helvetica Neue",
    "Helvetica",
    "Arial",
    "sans-serif",
  ],
  mono: ["Fira Code", "ui-monospace", "SFMono-Regular", "monospace"],

  // MARKETING-SCOPED display serif (ADR-0008). Editorial credibility on public
  // surfaces only — fenced from product UI by an ESLint rule so the clinical
  // surface typography never changes. System serif stack: no paid licence.
  display: [
    "Iowan Old Style",
    "Palatino Linotype",
    "Palatino",
    "Book Antiqua",
    "Georgia",
    "Times New Roman",
    "serif",
  ],
};

module.exports = { fonts };
