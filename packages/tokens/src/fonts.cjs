// =============================================================================
// FONT TOKENS — swappable from THIS FILE ONLY.
// -----------------------------------------------------------------------------
// Neue Haas Grotesk licensing for app bundling is unresolved (known open
// issue). The family is defined here so it can be swapped in one place without
// touching any component. Do not hardcode font names in components.
// =============================================================================

const fonts = {
  // Primary UI family. Swap the first entry when licensing is resolved.
  sans: [
    "Neue Haas Grotesk",
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
