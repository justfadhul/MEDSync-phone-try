const medsyncPreset = require("@medsync/tokens/preset");

/** @type {import('tailwindcss').Config} */
// @medsync/tokens is the single source of truth. The SAME preset is consumed by
// apps/web, so web and mobile resolve identical semantic tokens. nativewind/preset
// must come first; medsyncPreset overrides the colour palette with semantic tokens.
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset"), medsyncPreset],
};
