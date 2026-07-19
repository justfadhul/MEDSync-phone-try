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
    // The one place the fixtures may be imported.
    files: ["src/components/landing/**/*.{ts,tsx}"],
    rules: { "no-restricted-imports": "off" },
  },
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
