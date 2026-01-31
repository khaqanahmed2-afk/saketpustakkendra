-- Migration: Create products table
-- Created: 2026-01-31

CREATE TABLE IF NOT EXISTS "products" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "name" text NOT NULL,
    "category" text NOT NULL,
    "description" text,
    "image_url" text,
    "code" text,
    "price" numeric DEFAULT '0',
    "stock" numeric DEFAULT '0',
    "source" text DEFAULT 'system',
    "external_id" text,
    "created_at" timestamp DEFAULT now()
);

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_source ON products(source);
CREATE INDEX IF NOT EXISTS idx_products_external_id ON products(external_id);

COMMENT ON TABLE products IS 'Product catalog for shop inventory';
COMMENT ON COLUMN products.category IS 'Product category: School Essentials, Stationery, Competitive Books, Kids Education';
COMMENT ON COLUMN products.description IS 'Optional product description';
COMMENT ON COLUMN products.image_url IS 'Path to uploaded product image';
COMMENT ON COLUMN products.code IS 'SKU or Item Code (optional)';
COMMENT ON COLUMN products.source IS 'Source system: vyapar, system, etc';
COMMENT ON COLUMN products.external_id IS 'ID from the source system';
