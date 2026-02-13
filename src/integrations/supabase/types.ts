export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      drill_runs: {
        Row: {
          badges_earned: number
          category: string
          created_at: string
          difficulty: string
          drill_id: string
          drill_name: string
          id: string
          metrics_json: Json | null
          notes: string | null
          rating: string
          skill_tier_label: string
          source: string | null
          squad_size: number
          user_id: string
        }
        Insert: {
          badges_earned?: number
          category: string
          created_at?: string
          difficulty: string
          drill_id: string
          drill_name: string
          id?: string
          metrics_json?: Json | null
          notes?: string | null
          rating: string
          skill_tier_label?: string
          source?: string | null
          squad_size?: number
          user_id: string
        }
        Update: {
          badges_earned?: number
          category?: string
          created_at?: string
          difficulty?: string
          drill_id?: string
          drill_name?: string
          id?: string
          metrics_json?: Json | null
          notes?: string | null
          rating?: string
          skill_tier_label?: string
          source?: string | null
          squad_size?: number
          user_id?: string
        }
        Relationships: []
      }
      entitlements: {
        Row: {
          active: boolean
          entitlement_key: string
          expires_at: string | null
          granted_at: string
          id: string
          user_id: string
        }
        Insert: {
          active?: boolean
          entitlement_key: string
          expires_at?: string | null
          granted_at?: string
          id?: string
          user_id: string
        }
        Update: {
          active?: boolean
          entitlement_key?: string
          expires_at?: string | null
          granted_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      insights: {
        Row: {
          created_at: string
          evidence_json: Json | null
          explanation: string
          id: string
          insight_type: string
          recommendation: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          evidence_json?: Json | null
          explanation: string
          id?: string
          insight_type: string
          recommendation: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          evidence_json?: Json | null
          explanation?: string
          id?: string
          insight_type?: string
          recommendation?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      modules: {
        Row: {
          created_at: string
          created_by: string | null
          description: string
          difficulty: string
          game: string
          id: string
          name: string
          tags: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string
          difficulty?: string
          game?: string
          id?: string
          name: string
          tags?: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string
          difficulty?: string
          game?: string
          id?: string
          name?: string
          tags?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      scenarios: {
        Row: {
          created_at: string
          created_by: string | null
          estimated_minutes: number
          game_tag: string
          id: string
          module_id: string
          name: string
          pattern_tags: string[]
          roles_required: Json
          scenario_script_json: Json
          squad_size: number
          tier: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          estimated_minutes?: number
          game_tag?: string
          id?: string
          module_id: string
          name: string
          pattern_tags?: string[]
          roles_required?: Json
          scenario_script_json?: Json
          squad_size?: number
          tier?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          estimated_minutes?: number
          game_tag?: string
          id?: string
          module_id?: string
          name?: string
          pattern_tags?: string[]
          roles_required?: Json
          scenario_script_json?: Json
          squad_size?: number
          tier?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scenarios_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      scores: {
        Row: {
          breakdown_json: Json
          created_at: string
          failure_point_json: Json | null
          id: string
          pass_fail: boolean
          session_id: string
          total_score: number
          user_id: string
        }
        Insert: {
          breakdown_json?: Json
          created_at?: string
          failure_point_json?: Json | null
          id?: string
          pass_fail?: boolean
          session_id: string
          total_score?: number
          user_id: string
        }
        Update: {
          breakdown_json?: Json
          created_at?: string
          failure_point_json?: Json | null
          id?: string
          pass_fail?: boolean
          session_id?: string
          total_score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scores_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_events: {
        Row: {
          event_type: string
          id: string
          payload_json: Json
          role: string | null
          session_id: string
          timestamp: string
        }
        Insert: {
          event_type: string
          id?: string
          payload_json?: Json
          role?: string | null
          session_id: string
          timestamp?: string
        }
        Update: {
          event_type?: string
          id?: string
          payload_json?: Json
          role?: string | null
          session_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_participants: {
        Row: {
          created_at: string
          id: string
          role: string
          session_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string
          session_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          created_at: string
          ended_at: string | null
          host_user_id: string | null
          id: string
          mode: string
          scenario_id: string
          squad_id: string | null
          started_at: string | null
          status: string
        }
        Insert: {
          created_at?: string
          ended_at?: string | null
          host_user_id?: string | null
          id?: string
          mode?: string
          scenario_id: string
          squad_id?: string | null
          started_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          ended_at?: string | null
          host_user_id?: string | null
          id?: string
          mode?: string
          scenario_id?: string
          squad_id?: string | null
          started_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      tokens_ledger: {
        Row: {
          amount: number
          created_at: string
          id: string
          reason: string
          reference_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          reason: string
          reference_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          reason?: string
          reference_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      training_runs: {
        Row: {
          badges_earned: number
          category: string
          created_at: string
          difficulty: string
          drill_id: string
          drill_name: string
          id: string
          metrics_json: Json | null
          notes: string | null
          rating: string
          skill_tier_label: string
          squad_size: number
          user_id: string
        }
        Insert: {
          badges_earned?: number
          category: string
          created_at?: string
          difficulty: string
          drill_id: string
          drill_name: string
          id?: string
          metrics_json?: Json | null
          notes?: string | null
          rating: string
          skill_tier_label: string
          squad_size: number
          user_id: string
        }
        Update: {
          badges_earned?: number
          category?: string
          created_at?: string
          difficulty?: string
          drill_id?: string
          drill_name?: string
          id?: string
          metrics_json?: Json | null
          notes?: string | null
          rating?: string
          skill_tier_label?: string
          squad_size?: number
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
