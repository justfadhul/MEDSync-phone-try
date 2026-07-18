import type { Config } from "tailwindcss";

// Gate 0.1: minimal config so the app builds on Tailwind 3.4.x.
// Gate 0.2 replaces this with a preset generated from `@medsync/tokens`
// (the single source of truth) and wires the semantic-token layer.
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
