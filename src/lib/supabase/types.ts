export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          slug: string;
          name_key: string;
          desc_key: string;
          brand: string;
          amount: string;
          price: number;
          original_price: number | null;
          badge: "expert" | "bestseller" | "new" | null;
          category: string;
          rating: number;
          review_count: number;
          stock: number;
          ingredients_key: string;
          usage_key: string;
          expert_note_key: string | null;
          active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["products"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string | null;
          guest_email: string | null;
          status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
          total: number;
          discount: number;
          coupon_code: string | null;
          shipping_name: string;
          shipping_address: string;
          shipping_city: string;
          shipping_phone: string;
          items: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["orders"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string | null;
          order_id: string | null;
          author: string;
          rating: number;
          title: string;
          body: string;
          verified: boolean;
          approved: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["reviews"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
      };
      subscribers: {
        Row: {
          id: string;
          email: string;
          source: "footer" | "checkout" | "popup" | "other";
          active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["subscribers"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["subscribers"]["Insert"]>;
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          discount: number;
          type: "pct" | "flat";
          min_cart: number;
          max_uses: number | null;
          used_count: number;
          active: boolean;
          expires_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["coupons"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["coupons"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type Subscriber = Database["public"]["Tables"]["subscribers"]["Row"];
export type Coupon = Database["public"]["Tables"]["coupons"]["Row"];
