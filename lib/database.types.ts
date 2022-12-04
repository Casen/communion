export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      notes: {
        Row: {
          title: string | null
          body: string | null
          profile_id: string
          id: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          title?: string | null
          body?: string | null
          profile_id: string
          id?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          title?: string | null
          body?: string | null
          profile_id?: string
          id?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      install_available_extensions_and_test: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

