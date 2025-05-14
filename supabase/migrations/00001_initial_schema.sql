-- Initial database schema for Sushi Samurai Express
-- This migration creates all the necessary tables for the application

-- Note: JWT configuration is automatically handled by Supabase

-- Create custom types
CREATE TYPE public.user_role AS ENUM ('admin', 'staff', 'customer');
CREATE TYPE public.order_status AS ENUM ('pending', 'preparing', 'ready', 'delivered', 'cancelled');
CREATE TYPE public.delivery_method AS ENUM ('delivery', 'pickup');

-- Create tables with appropriate RLS policies
-----------------------------------------
-- USERS
-----------------------------------------
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    role public.user_role DEFAULT 'customer' NOT NULL,
    full_name TEXT,
    avatar_url TEXT
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow users to view and update their own data
CREATE POLICY "Users can view their own data"
    ON public.users
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
    ON public.users
    FOR UPDATE
    USING (auth.uid() = id);

-- Admins have full access
CREATE POLICY "Admins have full access to users"
    ON public.users
    USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
    );

-- Staff can view user data but not modify it
CREATE POLICY "Staff can view user data"
    ON public.users
    FOR SELECT
    USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'staff'
    );

-----------------------------------------
-- CATEGORIES
-----------------------------------------
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    slug TEXT NOT NULL UNIQUE,
    parent_id UUID REFERENCES public.categories(id)
);

CREATE INDEX categories_slug_idx ON public.categories (slug);
CREATE INDEX categories_parent_id_idx ON public.categories (parent_id);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Customers and staff can view categories
CREATE POLICY "Anyone can view categories"
    ON public.categories
    FOR SELECT
    TO authenticated, anon
    USING (true);

-- Admin/staff can manage categories
CREATE POLICY "Admin/staff can manage categories"
    ON public.categories
    USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'staff')
    );

-----------------------------------------
-- PRODUCTS
-----------------------------------------
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    category_id UUID REFERENCES public.categories(id),
    is_available BOOLEAN DEFAULT true NOT NULL,
    slug TEXT NOT NULL UNIQUE
);

CREATE INDEX products_category_id_idx ON public.products (category_id);
CREATE INDEX products_slug_idx ON public.products (slug);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Anyone can view products
CREATE POLICY "Anyone can view products"
    ON public.products
    FOR SELECT
    TO authenticated, anon
    USING (true);

-- Admin/staff can manage products
CREATE POLICY "Admin/staff can manage products"
    ON public.products
    USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'staff')
    );

-----------------------------------------
-- ORDERS
-----------------------------------------
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    user_id UUID NOT NULL REFERENCES public.users(id),
    status public.order_status DEFAULT 'pending' NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    delivery_method public.delivery_method DEFAULT 'pickup' NOT NULL,
    delivery_address JSONB,
    delivery_notes TEXT
);

CREATE INDEX orders_user_id_idx ON public.orders (user_id);
CREATE INDEX orders_status_idx ON public.orders (status);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
CREATE POLICY "Users can view their own orders"
    ON public.orders
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create their own orders
CREATE POLICY "Users can create their own orders"
    ON public.orders
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Admin/staff can view all orders
CREATE POLICY "Admin/staff can view all orders"
    ON public.orders
    FOR SELECT
    USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'staff')
    );

-- Admin/staff can update orders
CREATE POLICY "Admin/staff can update orders"
    ON public.orders
    FOR UPDATE
    USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'staff')
    );

-----------------------------------------
-- ORDER ITEMS
-----------------------------------------
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10, 2) NOT NULL,
    notes TEXT
);

CREATE INDEX order_items_order_id_idx ON public.order_items (order_id);
CREATE INDEX order_items_product_id_idx ON public.order_items (product_id);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Users can view their own order items
CREATE POLICY "Users can view their own order items"
    ON public.order_items
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = auth.uid()
        )
    );

-- Users can insert their own order items
CREATE POLICY "Users can insert their own order items"
    ON public.order_items
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = auth.uid()
        )
    );

-- Admin/staff can view all order items
CREATE POLICY "Admin/staff can view all order items"
    ON public.order_items
    FOR SELECT
    USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'staff')
    );

-- Admin/staff can manage order items
CREATE POLICY "Admin/staff can manage order items"
    ON public.order_items
    USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'staff')
    );

-----------------------------------------
-- MEDIA
-----------------------------------------
CREATE TABLE public.media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size INTEGER NOT NULL,
    user_id UUID NOT NULL REFERENCES public.users(id),
    metadata JSONB
);

CREATE INDEX media_user_id_idx ON public.media (user_id);

ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Users can view their own media
CREATE POLICY "Users can view their own media"
    ON public.media
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can manage their own media
CREATE POLICY "Users can manage their own media"
    ON public.media
    USING (auth.uid() = user_id);

-- Admin/staff can view all media
CREATE POLICY "Admin/staff can view all media"
    ON public.media
    FOR SELECT
    USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'staff')
    );

-- Admin/staff can manage all media
CREATE POLICY "Admin/staff can manage all media"
    ON public.media
    USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'staff')
    );

-----------------------------------------
-- HEALTH CHECK (for testing connection)
-----------------------------------------
CREATE TABLE public.health_check (
    id SERIAL PRIMARY KEY,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

INSERT INTO public.health_check (status) VALUES ('ok');

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating timestamps
CREATE TRIGGER handle_updated_at_users
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_categories
BEFORE UPDATE ON public.categories
FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_products
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_orders
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_media
BEFORE UPDATE ON public.media
FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
