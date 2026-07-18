import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import medsync from "../../tooling/eslint/no-raw-hex.mjs";

/** Flat config (ESLint 9). Plain-array form — no dependency on the
 *  `eslint/config` subpath, which is only available in ESLint 9.23+. */
const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  {
    plugins: { medsync },
    // Enforced across all app source. Components MUST use semantic tokens.
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "medsync/no-raw-hex": "error",
    },
  },
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
