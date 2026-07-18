// @medsync/types — shared types for the platform.
// Re-exports Drizzle-derived row types (source of truth: packages/db schema,
// which mirrors supabase/migrations). The Supabase `Database` type is generated
// by `supabase gen types typescript` once the project is linked (Gate 0.3
// residual step); until then the hand-written shape below matches migration
// 0001 and is replaced verbatim by the generated file.
export type { Profile, NewProfile } from "@medsync/db";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string | null;
          created_at: string;
          updated_at: string;
          created_by: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by: string;
          deleted_at?: string | null;
        };
        Update: {
          full_name?: string | null;
          deleted_at?: string | null;
        };
      };
    };
  };
};
