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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      child_professionals: {
        Row: {
          child_id: string
          created_at: string
          id: string
          profissional_id: string
          responsavel_id: string
        }
        Insert: {
          child_id: string
          created_at?: string
          id?: string
          profissional_id: string
          responsavel_id: string
        }
        Update: {
          child_id?: string
          created_at?: string
          id?: string
          profissional_id?: string
          responsavel_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "child_professionals_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      children: {
        Row: {
          created_at: string
          diagnostico: string | null
          dificuldades: string[] | null
          habilidades: string[] | null
          id: string
          idade: number
          nome: string
          observacoes: string | null
          preferencias: string[] | null
          profissional_id: string | null
          responsavel_id: string | null
          rotina_escolar: string | null
          sensibilidades: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          diagnostico?: string | null
          dificuldades?: string[] | null
          habilidades?: string[] | null
          id?: string
          idade: number
          nome: string
          observacoes?: string | null
          preferencias?: string[] | null
          profissional_id?: string | null
          responsavel_id?: string | null
          rotina_escolar?: string | null
          sensibilidades?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          diagnostico?: string | null
          dificuldades?: string[] | null
          habilidades?: string[] | null
          id?: string
          idade?: number
          nome?: string
          observacoes?: string | null
          preferencias?: string[] | null
          profissional_id?: string | null
          responsavel_id?: string | null
          rotina_escolar?: string | null
          sensibilidades?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "children_profissional_id_fkey"
            columns: ["profissional_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "children_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          especialidade: string | null
          id: string
          nome: string
          tipo: Database["public"]["Enums"]["user_type"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email: string
          especialidade?: string | null
          id: string
          nome: string
          tipo: Database["public"]["Enums"]["user_type"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          especialidade?: string | null
          id?: string
          nome?: string
          tipo?: Database["public"]["Enums"]["user_type"]
          updated_at?: string
        }
        Relationships: []
      }
      routines: {
        Row: {
          alimentacao: string | null
          atividades: string[] | null
          child_id: string
          comportamentos: string[] | null
          comunicacao: string | null
          created_at: string
          data: string
          energia: string | null
          eventos: string[] | null
          humor: string | null
          id: string
          interacao: string | null
          medicacao: string | null
          observacoes: string | null
          responsavel_id: string
          sono: string | null
        }
        Insert: {
          alimentacao?: string | null
          atividades?: string[] | null
          child_id: string
          comportamentos?: string[] | null
          comunicacao?: string | null
          created_at?: string
          data: string
          energia?: string | null
          eventos?: string[] | null
          humor?: string | null
          id?: string
          interacao?: string | null
          medicacao?: string | null
          observacoes?: string | null
          responsavel_id: string
          sono?: string | null
        }
        Update: {
          alimentacao?: string | null
          atividades?: string[] | null
          child_id?: string
          comportamentos?: string[] | null
          comunicacao?: string | null
          created_at?: string
          data?: string
          energia?: string | null
          eventos?: string[] | null
          humor?: string | null
          id?: string
          interacao?: string | null
          medicacao?: string | null
          observacoes?: string | null
          responsavel_id?: string
          sono?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "routines_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routines_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          atividades: string[] | null
          child_id: string
          comportamento: string[] | null
          created_at: string
          data: string
          desempenho: Json | null
          dificuldades: string[] | null
          duracao: number
          estrategias: string[] | null
          evolucao: string | null
          id: string
          objetivos: string[] | null
          observacoes: string | null
          profissional_id: string
          recomendacoes: string | null
        }
        Insert: {
          atividades?: string[] | null
          child_id: string
          comportamento?: string[] | null
          created_at?: string
          data: string
          desempenho?: Json | null
          dificuldades?: string[] | null
          duracao?: number
          estrategias?: string[] | null
          evolucao?: string | null
          id?: string
          objetivos?: string[] | null
          observacoes?: string | null
          profissional_id: string
          recomendacoes?: string | null
        }
        Update: {
          atividades?: string[] | null
          child_id?: string
          comportamento?: string[] | null
          created_at?: string
          data?: string
          desempenho?: Json | null
          dificuldades?: string[] | null
          duracao?: number
          estrategias?: string[] | null
          evolucao?: string | null
          id?: string
          objetivos?: string[] | null
          observacoes?: string | null
          profissional_id?: string
          recomendacoes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_profissional_id_fkey"
            columns: ["profissional_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_linked_professional: {
        Args: { _child_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      user_type: "profissional" | "responsavel"
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
    Enums: {
      user_type: ["profissional", "responsavel"],
    },
  },
} as const
