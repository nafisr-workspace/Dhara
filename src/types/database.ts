export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          phone: string | null
          role: "guest" | "operator"
          avatar_url: string | null
          id_type: "nid" | "passport" | null
          id_last_four: string | null
          notification_sms: boolean
          notification_email: boolean
          created_at: string
        }
        Insert: {
          id: string
          full_name: string
          phone?: string | null
          role: "guest" | "operator"
          avatar_url?: string | null
          id_type?: "nid" | "passport" | null
          id_last_four?: string | null
          notification_sms?: boolean
          notification_email?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          phone?: string | null
          role?: "guest" | "operator"
          avatar_url?: string | null
          id_type?: "nid" | "passport" | null
          id_last_four?: string | null
          notification_sms?: boolean
          notification_email?: boolean
          created_at?: string
        }
        Relationships: []
      }
      organizations: {
        Row: {
          id: string
          owner_id: string | null
          name: string
          logo_url: string | null
          bank_account_masked: string | null
          bank_account_encrypted: string | null
          contact_email: string | null
          status: "pending" | "approved" | "paused"
          created_at: string
        }
        Insert: {
          id?: string
          owner_id?: string | null
          name: string
          logo_url?: string | null
          bank_account_masked?: string | null
          bank_account_encrypted?: string | null
          contact_email?: string | null
          status?: "pending" | "approved" | "paused"
          created_at?: string
        }
        Update: {
          id?: string
          owner_id?: string | null
          name?: string
          logo_url?: string | null
          bank_account_masked?: string | null
          bank_account_encrypted?: string | null
          contact_email?: string | null
          status?: "pending" | "approved" | "paused"
          created_at?: string
        }
        Relationships: []
      }
      facilities: {
        Row: {
          id: string
          org_id: string
          name: string
          slug: string
          description: string | null
          type: "guesthouse" | "training_center" | "conference_center" | "mixed" | null
          division: string | null
          district: string | null
          area: string | null
          amenities: Json
          rules: Json
          impact_story: string | null
          community_activities: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          org_id: string
          name: string
          slug: string
          description?: string | null
          type?: "guesthouse" | "training_center" | "conference_center" | "mixed" | null
          division?: string | null
          district?: string | null
          area?: string | null
          amenities?: Json
          rules?: Json
          impact_story?: string | null
          community_activities?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          name?: string
          slug?: string
          description?: string | null
          type?: "guesthouse" | "training_center" | "conference_center" | "mixed" | null
          division?: string | null
          district?: string | null
          area?: string | null
          amenities?: Json
          rules?: Json
          impact_story?: string | null
          community_activities?: string | null
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      rooms: {
        Row: {
          id: string
          facility_id: string
          name: string
          type: "single" | "double" | "dorm" | "hall" | null
          capacity: number
          price_partner: number
          price_public: number
          price_corporate: number
          meal_addon_price: number
          hall_booking_price: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          facility_id: string
          name: string
          type?: "single" | "double" | "dorm" | "hall" | null
          capacity: number
          price_partner: number
          price_public: number
          price_corporate: number
          meal_addon_price?: number
          hall_booking_price?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          facility_id?: string
          name?: string
          type?: "single" | "double" | "dorm" | "hall" | null
          capacity?: number
          price_partner?: number
          price_public?: number
          price_corporate?: number
          meal_addon_price?: number
          hall_booking_price?: number
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          id: string
          booking_code: string
          guest_id: string | null
          room_id: string | null
          checkin_date: string
          checkout_date: string
          guest_count: number
          meal_included: boolean
          price_type: "partner" | "public" | "corporate" | null
          room_rate: number
          meal_charge: number
          platform_fee: number
          tax_amount: number
          total_amount: number
          payment_status: "pending" | "paid" | "refunded" | "cash_pending"
          payment_method: "bkash" | "nagad" | "card" | "cash" | null
          payment_reference: string | null
          cash_collected_by: string | null
          cash_collected_at: string | null
          status: "upcoming" | "checked_in" | "completed" | "cancelled"
          special_requests: string | null
          actual_checkin_at: string | null
          actual_checkout_at: string | null
          checked_in_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          booking_code: string
          guest_id?: string | null
          room_id?: string | null
          checkin_date: string
          checkout_date: string
          guest_count?: number
          meal_included?: boolean
          price_type?: "partner" | "public" | "corporate" | null
          room_rate: number
          meal_charge?: number
          platform_fee: number
          tax_amount: number
          total_amount: number
          payment_status?: "pending" | "paid" | "refunded" | "cash_pending"
          payment_method?: "bkash" | "nagad" | "card" | "cash" | null
          payment_reference?: string | null
          cash_collected_by?: string | null
          cash_collected_at?: string | null
          status?: "upcoming" | "checked_in" | "completed" | "cancelled"
          special_requests?: string | null
          actual_checkin_at?: string | null
          actual_checkout_at?: string | null
          checked_in_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          booking_code?: string
          guest_id?: string | null
          room_id?: string | null
          checkin_date?: string
          checkout_date?: string
          guest_count?: number
          meal_included?: boolean
          price_type?: "partner" | "public" | "corporate" | null
          room_rate?: number
          meal_charge?: number
          platform_fee?: number
          tax_amount?: number
          total_amount?: number
          payment_status?: "pending" | "paid" | "refunded" | "cash_pending"
          payment_method?: "bkash" | "nagad" | "card" | "cash" | null
          payment_reference?: string | null
          cash_collected_by?: string | null
          cash_collected_at?: string | null
          status?: "upcoming" | "checked_in" | "completed" | "cancelled"
          special_requests?: string | null
          actual_checkin_at?: string | null
          actual_checkout_at?: string | null
          checked_in_by?: string | null
          created_at?: string
        }
        Relationships: []
      }
      availability_blocks: {
        Row: {
          id: string
          room_id: string
          start_date: string
          end_date: string
          reason: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          start_date: string
          end_date: string
          reason?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          start_date?: string
          end_date?: string
          reason?: string | null
          created_by?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
