import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

dotenv.config();

async function fixProductsSchema() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        console.log('Connecting to database...');
        await client.connect();

        console.log('Checking products table structure...');

        // First, let's see if the table exists
        const tableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'products'
    `);

        if (tableCheck.rows.length === 0) {
            console.log('Creating products table from scratch...');
            await client.query(`
        CREATE TABLE "products" (
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
      `);
        } else {
            console.log('Products table exists. Adding missing columns...');

            // Add columns that might be missing
            try {
                await client.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT \'Stationery\'');
                console.log('✓ Added category column');
            } catch (e) {
                console.log('- category column already exists or failed');
            }

            try {
                await client.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS description text');
                console.log('✓ Added description column');
            } catch (e) {
                console.log('- description column already exists or failed');
            }

            try {
                await client.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url text');
                console.log('✓ Added image_url column');
            } catch (e) {
                console.log('- image_url column already exists or failed');
            }
        }

        console.log('Creating indexes...');
        await client.query('CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_products_source ON products(source)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_products_external_id ON products(external_id)');

        console.log('✅ Products table schema fixed successfully!');
        console.log('You can now add products to your shop!');

    } catch (err) {
        console.error('❌ Failed:', err.message);
        console.error('Full error:', err);
        throw err;
    } finally {
        await client.end();
    }
}

fixProductsSchema()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
