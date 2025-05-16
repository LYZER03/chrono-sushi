export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Export specific table types for easier use in tests and components
export type User = Database['public']['Tables']['users']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type Media = Database['public']['Tables']['media']['Row'];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
          role: 'admin' | 'staff' | 'customer'
          full_name: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          updated_at?: string
          role?: 'admin' | 'staff' | 'customer'
          full_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
          role?: 'admin' | 'staff' | 'customer'
          full_name?: string | null
          avatar_url?: string | null
        }
      }
      products: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string | null
          price: number
          image_url: string | null
          category_id: string | null
          is_available: boolean
          slug: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description?: string | null
          price: number
          image_url?: string | null
          category_id?: string | null
          is_available?: boolean
          slug: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string | null
          price?: number
          image_url?: string | null
          category_id?: string | null
          is_available?: boolean
          slug?: string
        }
      }
      categories: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string | null
          slug: string
          parent_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          description?: string | null
          slug: string
          parent_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          description?: string | null
          slug?: string
          parent_id?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
          total_price: number
          delivery_method: 'delivery' | 'pickup'
          delivery_address: Json | null
          delivery_notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          status?: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
          total_price: number
          delivery_method?: 'delivery' | 'pickup'
          delivery_address?: Json | null
          delivery_notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          status?: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
          total_price?: number
          delivery_method?: 'delivery' | 'pickup'
          delivery_address?: Json | null
          delivery_notes?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          created_at: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          notes?: string | null
        }
      }
      media: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          file_path: string
          mime_type: string
          size: number
          user_id: string
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          file_path: string
          mime_type: string
          size: number
          user_id: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          file_path?: string
          mime_type?: string
          size?: number
          user_id?: string
          metadata?: Json | null
        }
      }
      health_check: {
        Row: {
          id: number
          status: string
          created_at: string
        }
        Insert: {
          id?: number
          status: string
          created_at?: string
        }
        Update: {
          id?: number
          status?: string
          created_at?: string
        }
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
  }
}
