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
      charts: {
        Row: {
          id: string
          profile_id: string
          name: string | null
          birth_place_id: string | null
          birth_place: string | null
          birth_time: string | null
          birth_lat: number | null
          birth_lng: number | null
          earth: number | null
          water: number | null
          fire: number | null
          air: number | null
          enneagram: number | null
          created_at: string | null
          is_primary: boolean | null
        }
        Insert: {
          id?: string
          profile_id: string
          name?: string | null
          birth_place_id?: string | null
          birth_place?: string | null
          birth_time?: string | null
          birth_lat?: number | null
          birth_lng?: number | null
          earth?: number | null
          water?: number | null
          fire?: number | null
          air?: number | null
          enneagram?: number | null
          created_at?: string | null
          is_primary?: boolean | null
        }
        Update: {
          id?: string
          profile_id?: string
          name?: string | null
          birth_place_id?: string | null
          birth_place?: string | null
          birth_time?: string | null
          birth_lat?: number | null
          birth_lng?: number | null
          earth?: number | null
          water?: number | null
          fire?: number | null
          air?: number | null
          enneagram?: number | null
          created_at?: string | null
          is_primary?: boolean | null
        }
      }
      houses: {
        Row: {
          id: string
          position: number | null
          zodiac_name: string | null
          chart_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          position?: number | null
          zodiac_name?: string | null
          chart_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          position?: number | null
          zodiac_name?: string | null
          chart_id?: string
          created_at?: string | null
        }
      }
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
      planets: {
        Row: {
          id: string
          chart_id: string
          name: string
          lng: number
          zodiac_name: string | null
          zodiac_degrees: number | null
          house: number | null
          nak_name: string | null
          nak_sex: string | null
          nak_animal: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          chart_id: string
          name?: string
          lng: number
          zodiac_name?: string | null
          zodiac_degrees?: number | null
          house?: number | null
          nak_name?: string | null
          nak_sex?: string | null
          nak_animal?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          chart_id?: string
          name?: string
          lng?: number
          zodiac_name?: string | null
          zodiac_degrees?: number | null
          house?: number | null
          nak_name?: string | null
          nak_sex?: string | null
          nak_animal?: string | null
          created_at?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          created_at: string
          ip: string | null
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          ip?: string | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          ip?: string | null
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

