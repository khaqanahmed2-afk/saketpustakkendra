-- Migration: Add product management fields
-- Created: 2026-01-31

-- Add new columns to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'Stationery',
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Make price optional (remove NOT NULL constraint if it exists)
ALTER TABLE products 
ALTER COLUMN price DROP NOT NULL;

-- Update existing products to have a default category if needed
UPDATE products 
SET category = 'Stationery' 
WHERE category IS NULL;

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

COMMENT ON COLUMN products.category IS 'Product category: School Essentials, Stationery, Competitive Books, Kids Education';
COMMENT ON COLUMN products.description IS 'Optional product description';
COMMENT ON COLUMN products.image_url IS 'Path to uploaded product image';
