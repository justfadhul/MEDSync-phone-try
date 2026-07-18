import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

// Mirrors supabase/migrations/0001_profiles.sql. The migrations are the DB
// source of truth (RLS/triggers live there); this schema is the source of the
// TypeScript types re-exported from @medsync/types. CI checks the two agree.
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(), // default uuid_generate_v7() (server-side)
  userId: uuid("user_id").notNull().unique(), // -> auth.users(id)
  fullName: text("full_name"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  createdBy: uuid("created_by").notNull(), // -> auth.users(id)
  deletedAt: timestamp("deleted_at", { withTimezone: true }), // soft delete
});

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
