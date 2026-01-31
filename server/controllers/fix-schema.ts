import { Request, Response } from "express";
import { db } from "../db";
import { sql } from "drizzle-orm";

// Temporary endpoint to fix the products table schema
export async function fixProductsSchema(req: Request, res: Response) {
    try {
        console.log("Checking products table...");

        // Create products table if it doesn't exist
        await db.execute(sql`
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
        `);

        console.log("Products table ensured");

        //Create indexes
        await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);`);
        await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_products_source ON products(source);`);
        await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_products_external_id ON products(external_id);`);

        console.log("Indexes created");

        res.json({
            success: true,
            message: "Products table schema fixed successfully"
        });
    } catch (error: any) {
        console.error("Error fixing schema:", error);
        res.status(500).json({
            error: "Failed to fix schema",
            details: error.message
        });
    }
}
