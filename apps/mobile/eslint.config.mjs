import tsParser from "@typescript-eslint/parser";
import medsync from "../../tooling/eslint/no-raw-hex.mjs";

/** Minimal flat config. The safety-critical rule for Phase 0 is no-raw-hex:
 *  mobile components must use semantic tokens (@medsync/tokens) too. */
const eslintConfig = [
  {
    files: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { medsync },
    rules: {
      "medsync/no-raw-hex": "error",
    },
  },
  {
    ignores: ["dist/**", ".expo/**", "expo-env.d.ts", "nativewind-env.d.ts"],
  },
];

export default eslintConfig;
