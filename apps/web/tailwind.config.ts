import type { Config } from "tailwindcss";
import medsyncPreset from "@medsync/tokens/preset-web";

// The token layer (@medsync/tokens) is the single source of truth. Web uses the
// CSS-variable preset (preset-web) so a single class set serves both themes:
// LIGHT on :root (clinical surfaces stay here), DARK under `.theme-dark` which
// only OPERATIONAL surfaces opt into. Mobile uses the baked `preset`. Do not add
// colours here — add them to packages/tokens/src/semantic.cjs.
const config: Config = {
  presets: [medsyncPreset as Config],
  content: ["./src/**/*.{ts,tsx,mdx}"],
};

export default config;
