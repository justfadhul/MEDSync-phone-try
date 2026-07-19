// @medsync/types — shared types for the platform.
// Re-exports Drizzle-derived row types (source of truth: packages/db schema,
// which mirrors supabase/migrations). The Supabase `Database` type is generated
// by `supabase gen types typescript` once the project is linked (Gate 0.3/0.4
// residual step); until then the hand-written shape below matches migrations
// 0001–0002 and follows the exact shape supabase-js expects (Tables with
// Relationships, Views, Functions, Enums, CompositeTypes), so the typed client
// resolves inserts/updates/rpc correctly rather than to `never`.
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
        Relationships: [];
      };
      roles: {
        Row: {
          id: string;
          key: string;
          label: string;
          requires_mfa: boolean;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          key: string;
          label: string;
          requires_mfa?: boolean;
          is_admin?: boolean;
          created_by?: string | null;
        };
        Update: {
          label?: string;
          requires_mfa?: boolean;
          is_admin?: boolean;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role_id: string;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          role_id: string;
          created_by?: string | null;
          deleted_at?: string | null;
        };
        Update: {
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      // Public marketing waitlist (migration 0005). Anon INSERT only — no SELECT
      // to anon — so from the outside it is write-only. Not PHI.
      waitlist: {
        Row: {
          id: string;
          email: string;
          source: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          source?: string | null;
          created_at?: string;
        };
        Update: {
          source?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: {
      user_role_keys: {
        Args: Record<never, never>;
        Returns: string[];
      };
      is_admin: {
        Args: Record<never, never>;
        Returns: boolean;
      };
      user_requires_mfa: {
        Args: Record<never, never>;
        Returns: boolean;
      };
      has_aal2: {
        Args: Record<never, never>;
        Returns: boolean;
      };
      mfa_satisfied: {
        Args: Record<never, never>;
        Returns: boolean;
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};
