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
      // getSession() trusts the local cookie without revalidating the JWT and
      // must never back an authorization decision. Use getUser() instead.
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "MemberExpression[property.name='getSession']",
          message:
            "Do not use getSession() for authorization — it does not revalidate the JWT. Use supabase.auth.getUser().",
        },
        {
          // Marketing-scoped display serif (ADR-0008). Fenced to
          // components/landing + components/marketing (override below).
          selector: "Literal[value=/\\bfont-display\\b/]",
          message:
            "font-display is a marketing-only face — use it in components/landing or components/marketing only. Product UI stays on font-sans / font-mono.",
        },
      ],
      // Marketing fixtures are a labelled asset, not a data layer. They may be
      // imported ONLY from components/landing/ (override below re-permits it).
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/landing-fixtures", "@/lib/landing-fixtures"],
              message:
                "landing-fixtures is illustrative marketing data — import it only from components/landing/, never into product code.",
            },
          ],
        },
      ],
    },
  },
  {
    // Marketing surfaces: fixtures may be imported, and the display serif is
    // permitted. getSession() stays banned (re-declared, font-display dropped).
    files: [
      "src/components/landing/**/*.{ts,tsx}",
      "src/components/marketing/**/*.{ts,tsx}",
      "src/app/page.tsx",
      "src/app/get-started/**/*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": "off",
      "no-restricted-syntax": [
        "error",
        {
          selector: "MemberExpression[property.name='getSession']",
          message:
            "Do not use getSession() for authorization — it does not revalidate the JWT. Use supabase.auth.getUser().",
        },
      ],
    },
  },
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
