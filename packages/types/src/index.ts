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
      // Staff onboarding application (migration 0009). Owner-scoped. Only the
      // `status` is read at sign-in to resolve the honest pending/ready state.
      staff_applications: {
        Row: {
          id: string;
          user_id: string;
          is_returning: boolean;
          status: string;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          is_returning?: boolean;
          status?: string;
          created_by?: string | null;
        };
        Update: {
          is_returning?: boolean;
          status?: string;
        };
        Relationships: [];
      };
      // Hospital onboarding application (migration 0010). Created `submitted`
      // (pending) and routed to a superadmin. Only `status` is read at sign-in.
      hospital_applications: {
        Row: {
          id: string;
          submitted_by: string;
          facility_name: string;
          official_email: string;
          official_phone: string | null;
          district_id: string | null;
          subcounty_id: string | null;
          level: string | null;
          ownership: string | null;
          registration_no_ct: string | null;
          licence_doc_path: string | null;
          status: string;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          submitted_by: string;
          facility_name: string;
          official_email: string;
          official_phone?: string | null;
          district_id?: string | null;
          subcounty_id?: string | null;
          level?: string | null;
          ownership?: string | null;
          registration_no_ct?: string | null;
          licence_doc_path?: string | null;
          status?: string;
          created_by?: string | null;
        };
        Update: {
          status?: string;
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
      is_superadmin: {
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
