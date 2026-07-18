import { defineConfig } from "drizzle-kit";

// The DB source of truth is the hand-authored SQL in supabase/migrations/
// (they carry RLS, triggers and grants that Drizzle does not model). This
// config is used for schema introspection / type generation and drift checks,
// not to generate the production migrations.
export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgres://localhost:5432/placeholder",
  },
});
