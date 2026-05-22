export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type PublicTables = {
  performers: {
    Row: {
      id: string;
      name: string;
      aliases: string[];
      tags: string[];
      notes: string;
      avatar_color: string;
      created_at: string;
      updated_at: string;
      owner_id: string | null;
    };
    Insert: {
      id?: string;
      name: string;
      aliases?: string[];
      tags?: string[];
      notes?: string;
      avatar_color?: string;
      created_at?: string;
      updated_at?: string;
      owner_id?: string | null;
    };
    Update: Partial<PublicTables["performers"]["Insert"]>;
    Relationships: [];
  };
  tags: {
    Row: {
      id: string;
      name: string;
      category: string;
      created_at: string;
      updated_at: string;
      owner_id: string | null;
    };
    Insert: {
      id?: string;
      name: string;
      category?: string;
      created_at?: string;
      updated_at?: string;
      owner_id?: string | null;
    };
    Update: Partial<PublicTables["tags"]["Insert"]>;
    Relationships: [];
  };
  collections: {
    Row: {
      id: string;
      name: string;
      description: string;
      cover_color: string;
      created_at: string;
      updated_at: string;
      owner_id: string | null;
    };
    Insert: {
      id?: string;
      name: string;
      description?: string;
      cover_color?: string;
      created_at?: string;
      updated_at?: string;
      owner_id?: string | null;
    };
    Update: Partial<PublicTables["collections"]["Insert"]>;
    Relationships: [];
  };
  videos: {
    Row: {
      id: string;
      title: string;
      date_added: string;
      duration_seconds: number;
      rating: number;
      notes: string;
      is_favorite: boolean;
      thumbnail_color: string;
      video_url: string | null;
      video_storage_path: string | null;
      thumbnail_url: string | null;
      thumbnail_storage_path: string | null;
      created_at: string;
      updated_at: string;
      owner_id: string | null;
      updated_by: string | null;
    };
    Insert: {
      id?: string;
      title: string;
      date_added?: string;
      duration_seconds?: number;
      rating?: number;
      notes?: string;
      is_favorite?: boolean;
      thumbnail_color?: string;
      video_url?: string | null;
      video_storage_path?: string | null;
      thumbnail_url?: string | null;
      thumbnail_storage_path?: string | null;
      created_at?: string;
      updated_at?: string;
      owner_id?: string | null;
      updated_by?: string | null;
    };
    Update: Partial<PublicTables["videos"]["Insert"]>;
    Relationships: [];
  };
  video_performers: {
    Row: {
      video_id: string;
      performer_id: string;
      created_at: string;
      owner_id: string | null;
    };
    Insert: {
      video_id: string;
      performer_id: string;
      created_at?: string;
      owner_id?: string | null;
    };
    Update: Partial<PublicTables["video_performers"]["Insert"]>;
    Relationships: [
      {
        foreignKeyName: "video_performers_video_id_fkey";
        columns: ["video_id"];
        isOneToOne: false;
        referencedRelation: "videos";
        referencedColumns: ["id"];
      },
      {
        foreignKeyName: "video_performers_performer_id_fkey";
        columns: ["performer_id"];
        isOneToOne: false;
        referencedRelation: "performers";
        referencedColumns: ["id"];
      },
    ];
  };
  video_tags: {
    Row: {
      video_id: string;
      tag_id: string;
      created_at: string;
      owner_id: string | null;
    };
    Insert: {
      video_id: string;
      tag_id: string;
      created_at?: string;
      owner_id?: string | null;
    };
    Update: Partial<PublicTables["video_tags"]["Insert"]>;
    Relationships: [
      {
        foreignKeyName: "video_tags_video_id_fkey";
        columns: ["video_id"];
        isOneToOne: false;
        referencedRelation: "videos";
        referencedColumns: ["id"];
      },
      {
        foreignKeyName: "video_tags_tag_id_fkey";
        columns: ["tag_id"];
        isOneToOne: false;
        referencedRelation: "tags";
        referencedColumns: ["id"];
      },
    ];
  };
  collection_videos: {
    Row: {
      collection_id: string;
      video_id: string;
      created_at: string;
      owner_id: string | null;
    };
    Insert: {
      collection_id: string;
      video_id: string;
      created_at?: string;
      owner_id?: string | null;
    };
    Update: Partial<PublicTables["collection_videos"]["Insert"]>;
    Relationships: [
      {
        foreignKeyName: "collection_videos_collection_id_fkey";
        columns: ["collection_id"];
        isOneToOne: false;
        referencedRelation: "collections";
        referencedColumns: ["id"];
      },
      {
        foreignKeyName: "collection_videos_video_id_fkey";
        columns: ["video_id"];
        isOneToOne: false;
        referencedRelation: "videos";
        referencedColumns: ["id"];
      },
    ];
  };
  user_preferences: {
    Row: {
      id: string;
      display_name: string;
      default_sort: "dateAdded" | "title" | "rating" | "duration";
      items_per_row: number;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      display_name?: string;
      default_sort?: "dateAdded" | "title" | "rating" | "duration";
      items_per_row?: number;
      created_at?: string;
      updated_at?: string;
    };
    Update: Partial<PublicTables["user_preferences"]["Insert"]>;
    Relationships: [];
  };
};

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: PublicTables;
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
