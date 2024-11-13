export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export type Database = {
    public: {
        Tables: {
            bookings: {
                Row: {
                    cabin_id: number | null;
                    cabin_price: number | null;
                    created_at: string;
                    ending_date: string | null;
                    extras_price: number | null;
                    guest_id: number | null;
                    has_breakfast: boolean | null;
                    id: number;
                    is_paid: boolean | null;
                    num_guests: number | null;
                    num_nights: number | null;
                    observations: string | null;
                    starting_date: string | null;
                    status: string | null;
                    total_price: number | null;
                };
                Insert: {
                    cabin_id?: number | null;
                    cabin_price?: number | null;
                    created_at?: string;
                    ending_date?: string | null;
                    extras_price?: number | null;
                    guest_id?: number | null;
                    has_breakfast?: boolean | null;
                    id?: number;
                    is_paid?: boolean | null;
                    num_guests?: number | null;
                    num_nights?: number | null;
                    observations?: string | null;
                    starting_date?: string | null;
                    status?: string | null;
                    total_price?: number | null;
                };
                Update: {
                    cabin_id?: number | null;
                    cabin_price?: number | null;
                    created_at?: string;
                    ending_date?: string | null;
                    extras_price?: number | null;
                    guest_id?: number | null;
                    has_breakfast?: boolean | null;
                    id?: number;
                    is_paid?: boolean | null;
                    num_guests?: number | null;
                    num_nights?: number | null;
                    observations?: string | null;
                    starting_date?: string | null;
                    status?: string | null;
                    total_price?: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "bookings_cabin_id_fkey";
                        columns: ["cabin_id"];
                        isOneToOne: false;
                        referencedRelation: "cabins";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "bookings_guest_id_fkey";
                        columns: ["guest_id"];
                        isOneToOne: false;
                        referencedRelation: "guests";
                        referencedColumns: ["id"];
                    }
                ];
            };
            busy_days: {
                Row: {
                    created_at: string;
                    day: number | null;
                    id: number;
                    month: number | null;
                    year: number | null;
                };
                Insert: {
                    created_at?: string;
                    day?: number | null;
                    id?: number;
                    month?: number | null;
                    year?: number | null;
                };
                Update: {
                    created_at?: string;
                    day?: number | null;
                    id?: number;
                    month?: number | null;
                    year?: number | null;
                };
                Relationships: [];
            };
            events_scheduled: {
                Row: {
                    id: number;
                    date: string | Date;
                };
                Insert: {
                    id?: number;
                    date?: string | Date;
                };
                Update: {
                    id?: number;
                    date?: string | Date;
                };
                Relationships: [];
            };
            events: {
                Row: {
                    created_at: string;
                    date: string;
                    description: string;
                    email: string;
                    id: number;
                    name: string;
                    personal_notes?: string;
                };
                Insert: {
                    created_at?: string;
                    date?: string;
                    description?: string;
                    email?: string;
                    id?: number;
                    name?: string;
                    personal_notes?: string;
                };
                Update: {
                    created_at?: string;
                    date?: string;
                    description?: string;
                    email?: string;
                    id?: number;
                    name?: string;
                    personal_notes?: string;
                };
                Relationships: [];
            };
            captcha_images: {
                Row: {
                    id: number;
                    created_at?: string;
                    image_url: string;
                    keyword: string;
                };
                Insert: {
                    id: number;
                    created_at?: string;
                    image_url: string;
                    keyword: string;
                };
                Update: {
                    id: number;
                    created_at?: string;
                    image_url: string;
                    keyword: string;
                };
                Relationships: [];
            };
            settings: {
                Row: {
                    breakfast_price: number | null;
                    created_at: string;
                    id: number;
                    max_booking_duration: number | null;
                    max_guests_per_booking: number | null;
                    min_booking_duration: number | null;
                };
                Insert: {
                    breakfast_price?: number | null;
                    created_at?: string;
                    id?: number;
                    max_booking_duration?: number | null;
                    max_guests_per_booking?: number | null;
                    min_booking_duration?: number | null;
                };
                Update: {
                    breakfast_price?: number | null;
                    created_at?: string;
                    id?: number;
                    max_booking_duration?: number | null;
                    max_guests_per_booking?: number | null;
                    min_booking_duration?: number | null;
                };
                Relationships: [];
            };
        };
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

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
    PublicTableNameOrOptions extends
        | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
              Database[PublicTableNameOrOptions["schema"]]["Views"])
        : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
          Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
          Row: infer R;
      }
        ? R
        : never
    : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
          PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
          PublicSchema["Views"])[PublicTableNameOrOptions] extends {
          Row: infer R;
      }
        ? R
        : never
    : never;

export type TablesInsert<
    PublicTableNameOrOptions extends
        | keyof PublicSchema["Tables"]
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Insert: infer I;
      }
        ? I
        : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
          Insert: infer I;
      }
        ? I
        : never
    : never;

export type TablesUpdate<
    PublicTableNameOrOptions extends
        | keyof PublicSchema["Tables"]
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Update: infer U;
      }
        ? U
        : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
          Update: infer U;
      }
        ? U
        : never
    : never;

export type Enums<
    PublicEnumNameOrOptions extends
        | keyof PublicSchema["Enums"]
        | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
        : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
        | keyof PublicSchema["CompositeTypes"]
        | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
        : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
