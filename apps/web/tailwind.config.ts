import type { Config } from "tailwindcss";
import medsyncPreset from "@medsync/tokens/preset";

// The token layer (@medsync/tokens) is the single source of truth. This preset
// is generated from it and is the SAME preset the mobile app consumes, so web
// and mobile resolve identical semantic tokens. Do not add colours here — add
// them to packages/tokens/src/semantic.cjs.
const config: Config = {
  presets: [medsyncPreset as Config],
  content: ["./src/**/*.{ts,tsx,mdx}"],
};

export default config;
